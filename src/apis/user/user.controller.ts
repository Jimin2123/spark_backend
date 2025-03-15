import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/entities/dtos/user.dto';
import { CurrentUser, CurrentUserRole } from 'src/common/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Get('cache')
  async cacheData() {
    await this.userService.cacheData();
    return { message: 'Data cached!' };
  }

  @Get('fetch')
  async fetchData() {
    const data = await this.userService.getData();
    return { data };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getUser(@CurrentUser() userId: string) {
    return this.userService.findUserById(userId);
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUserById(@Param('userId') uid: string, @CurrentUserRole() role: UserRole) {
    return this.userService.findUserById(uid, role);
  }
}
