import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { TokenDto } from './dto/token.dto';
import { LoginDto } from './dto/login.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokenDto, { name: 'login' })
  public async login(
    @Args('body', { type: () => LoginDto })
    body: LoginDto,
  ): Promise<TokenDto> {
    return new TokenDto({
      token: this.authService.getTokenForUser(
        await this.authService.validateUser(body.username, body.password),
      ),
    });
  }
}
