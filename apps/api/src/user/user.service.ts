import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    if (!id) {
    throw new Error("User ID is required to find user");
  }
    return this.prisma.user.findUnique({
      where: { id },
      // include: { documents: true }, // because your User entity has `documents`
    });
  }
}
