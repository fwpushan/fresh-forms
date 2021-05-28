import { Controller, Get } from '@nestjs/common';
import { UserToken } from 'src/modules/auth';
import { UserService } from 'src/modules/user/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}
  @Get('check-user')
  async checkUser(@UserToken() token) {
    return this.service.checkUser(token);
  }
}
