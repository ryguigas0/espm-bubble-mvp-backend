import { Controller, Get, Post, Body, Patch, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/public.decorator';
import type { LoggedInReq } from 'src/util/loged-in-req';
import { UserDto } from './dto/user.dto';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get('me')
  async findOne(@Request() req: LoggedInReq) {
    const currUser = await this.usersService.findOne(req.user.sub);

    return new UserDto(req.user.sub, currUser.toObject());
  }

  @Patch('me')
  async update(
    @Request() req: LoggedInReq,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.update(
      req.user.sub,
      updateUserDto,
    );
    return updatedUser;
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
