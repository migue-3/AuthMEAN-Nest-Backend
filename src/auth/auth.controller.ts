import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { loginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login( @Body() loginDto: loginDto) {
    return this.authService.login( loginDto );
  }

  @Post('register')
  register( @Body() registerDto: RegisterUserDto) {
    return this.authService.register( registerDto );
  }

  @UseGuards( AuthGuard )
  @Get()
  findAll( @Request() req: Request ) {
    // const user = req['user']; //con esto tenemos el id del usuario que viene en el token

    // return user;
    return this.authService.findAll();
  }

  @UseGuards( AuthGuard )
  @Get('check-token')
  checkToken( @Request() req: Request ): LoginResponse {
    const user = req['user'] as User;

    return {
      user: user,
      token: this.authService.getJwtToken({ id: user._id })
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
