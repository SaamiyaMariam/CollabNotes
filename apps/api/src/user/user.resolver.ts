import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt'

@Resolver(() => User)
export class UserResolver {
  constructor
  (private userService: UserService,
    private prisma: PrismaService,
  ) {}

@Query(() => User, { nullable: true })
@UseGuards(GqlAuthGuard)
async me(@CurrentUser() user: { userId: string; email: string }) {
  return this.userService.findById(user.userId);
}

  @Mutation(() => User)
  async resetPassword(
    @Args('email') email: string,
    @Args('newPassword') newPassword: string,
  ) {
    const hash = await bcrypt.hash(newPassword, 10);

    return this.prisma.user.update({
      where: { email: email },
      data: { password: hash },
    });
  }


}
