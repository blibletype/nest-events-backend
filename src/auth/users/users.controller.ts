import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CreateUserDto } from '../dto/create.user.dto';
import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    const user = await this.usersService.create(body);

    return {
      ...user,
      token: this.authService.getTokenForUser(user),
    };
  }
}
