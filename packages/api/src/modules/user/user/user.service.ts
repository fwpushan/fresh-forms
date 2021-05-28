import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from 'src/types/userInfo';
import { User } from 'src/modules/database';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async checkUser(user: UserInfo): Promise<string> {
    const existing = await this.userRepo.findOne({
      userId: user.sub,
    });
    if (!existing) {
      const newUser = this.userRepo.create();
      newUser.email = user.email;
      newUser.userId = user.sub;
      newUser.name = user.name;
      newUser.userName = user.preferred_username;
      await this.userRepo.save([newUser]);
      return newUser.id;
    }
    return existing.id;
  }
}
