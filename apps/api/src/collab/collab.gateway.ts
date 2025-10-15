import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as Y from 'yjs';
import { decodeUpdate, encodeStateAsUpdate, applyUpdate } from 'yjs';
import { YDocStateService } from './ydoc-state.service';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// This gateway handles real-time note editing collaboration
@WebSocketGateway({
  namespace: '/collab',
  cors: { origin: '*' },
})
export class CollabGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(CollabGateway.name);
  private docs = new Map<string, Y.Doc>();

  constructor(
    private readonly ydocStateService: YDocStateService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ───────────────────────────────────────────────
  // Handle connection
  // ───────────────────────────────────────────────
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) throw new Error('Missing token');
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = this.jwtService.verify(token, { secret });
      (client as any).userId = payload.sub;
      this.logger.debug(`Client ${payload.sub} connected`);
    } catch (err) {
      this.logger.warn(`Unauthorized connection attempt`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client ${client.id} disconnected`);
  }

  // ───────────────────────────────────────────────
  // Join a note room
  // ───────────────────────────────────────────────
  @SubscribeMessage('join_note')
  async handleJoinNote(
    @ConnectedSocket() client: Socket,
    @MessageBody('noteId') noteId: string,
  ) {
    const userId = (client as any).userId;
    this.logger.debug(`User ${userId} joining note ${noteId}`);

    // AuthZ: verify access (owner or collaborator)
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      include: { collaborators: true },
    });

    if (
      !note ||
      (note.ownerId !== userId &&
        !note.collaborators.some((c) => c.userId === userId))
    ) {
      client.emit('error', 'Access denied');
      return;
    }

    client.join(noteId);

    let ydoc = this.docs.get(noteId);
    if (!ydoc) {
      ydoc = new Y.Doc();
      const persisted = await this.ydocStateService.getState(noteId);
      if (persisted) {
        applyUpdate(ydoc, persisted);
      }
      this.docs.set(noteId, ydoc);
    }

    const state = encodeStateAsUpdate(ydoc);
    client.emit('note_state', state);
  }

  // ───────────────────────────────────────────────
  // Handle incoming Y.js updates
  // ───────────────────────────────────────────────
  @SubscribeMessage('update_note')
  async handleUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { noteId: string; update: Uint8Array },
  ) {
    const { noteId, update } = data;
    const ydoc = this.docs.get(noteId);
    if (!ydoc) return;

    applyUpdate(ydoc, new Uint8Array(update));
    client.to(noteId).emit('update_note', update);

    // Optionally throttle persistence (every 30s)
    this.debouncedSave(noteId, ydoc);
  }

  private saveTimeouts = new Map<string, NodeJS.Timeout>();
  private debouncedSave(noteId: string, ydoc: Y.Doc) {
    if (this.saveTimeouts.has(noteId)) clearTimeout(this.saveTimeouts.get(noteId)!);
    const timeout = setTimeout(async () => {
      const state = encodeStateAsUpdate(ydoc);
      await this.ydocStateService.saveState(noteId, state);
      this.saveTimeouts.delete(noteId);
    }, 30000);
    this.saveTimeouts.set(noteId, timeout);
  }
}
