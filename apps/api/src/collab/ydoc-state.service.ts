import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class YDocStateService {
  private readonly logger = new Logger(YDocStateService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getState(noteId: string): Promise<Uint8Array | null> {
    const record = await this.prisma.yDocState.findUnique({
      where: { noteId },
    });
    return record ? new Uint8Array(record.state as Buffer) : null;
  }

  async saveState(noteId: string, state: Uint8Array) {
    this.logger.debug(`Persisting YDoc state for note ${noteId}`);
    await this.prisma.yDocState.upsert({
      where: { noteId },
      update: { state },
      create: { noteId, state },
    });
  }
}
