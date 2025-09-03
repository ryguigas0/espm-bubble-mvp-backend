import {
  Controller,
  Get,
  Body,
  Patch,
  Request,
  Post,
  Delete,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { LoggedInReq } from 'src/util/loged-in-req';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddFriendDto } from './dto/add-friend.dto';
import { BlockUserDto } from './dto/block-user.dto';

@Controller('v1/users/me')
export class UsersMeController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findOne(@Request() req: LoggedInReq) {
    const currUser = await this.usersService.findOne(req.user.sub);

    return new UserDto(req.user.sub, currUser.toObject());
  }

  @Patch()
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

  @Post('friends')
  async addFriend(
    @Request() req: LoggedInReq,
    @Body() addFriendDto: AddFriendDto,
  ) {
    const result = await this.usersService.addFriend(
      req.user.sub,
      addFriendDto.friendId,
    );

    return result;
  }

  @Get('friends')
  async getFriends(@Request() req: LoggedInReq) {
    const friends = await this.usersService.getFriends(req.user.sub);

    return friends.map((f) => new UserDto(f._id.toString(), f));
  }

  @Delete('friends/:friendId')
  async removeFriend(
    @Request() req: LoggedInReq,
    @Param('friendId') friendId: string,
  ) {
    const result = await this.usersService.removeFriend(req.user.sub, friendId);

    return result;
  }

  @Post('block')
  async blockUser(
    @Request() req: LoggedInReq,
    @Body() blockUserDto: BlockUserDto,
  ) {
    const result = await this.usersService.blockUser(
      req.user.sub,
      blockUserDto.blockedUserId,
    );

    return result;
  }

  @Get('block')
  async getBlockList(@Request() req: LoggedInReq) {
    const blockedUsers = await this.usersService.getBlockList(req.user.sub);

    return blockedUsers.map((f) => new UserDto(f._id.toString(), f));
  }

  @Delete('block/:blockedUserId')
  async unblockUser(
    @Request() req: LoggedInReq,
    @Param('blockedUserId') blockedUserId: string,
  ) {
    const result = await this.usersService.unblockUser(
      req.user.sub,
      blockedUserId,
    );

    return result;
  }

  // @Post('block')
  // async getFriends(
  //   @Request() req: LoggedInReq,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   const updatedUser = await this.usersService.blockUser(
  //     req.user.sub,
  //     updateUserDto,
  //   );

  //   return updatedUser;
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
