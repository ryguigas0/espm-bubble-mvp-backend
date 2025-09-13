import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Coordinates } from 'src/util/schemas/coordinates.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;

    const userWithEmail = await this.findByEmail(email);

    if (userWithEmail) throw new BadRequestException('Email already taken!');

    const embeddings = new Array(10)
      .fill(1)
      .map(() => Math.ceil(Math.random() * 4 + 1));

    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const newUser = await this.userModel.create({
        email,
        name,
        passwordHash,
        embeddings,
      });
      return { id: newUser._id.toString() };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException(`User ${id} not found!`);
      }

      return user;
    } catch (_error) {
      throw new BadRequestException(`Invalid ID ${id}`);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel
        .findOne({
          email: email,
        })
        .exec();

      return user;
    } catch (_error) {
      throw new BadRequestException('Invalid email');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const { email, lat, lon, name } = updateUserDto;

    if (!email && !lat && !lon && !name) {
      return { id, message: 'No changes' };
    }

    let coords: Coordinates | undefined = undefined;

    if (lat && lon) {
      coords = {
        type: 'Point',
        coordinates: [lon, lat],
      };
    }
    const _updateResult = await this.userModel
      .updateOne(
        { _id: user._id },
        {
          email,
          name,
          coords,
        },
      )
      .exec();

    return { id: user._id, message: 'Updated' };
  }

  async addFriend(userId: string, friendId: string) {
    if (userId === friendId)
      throw new BadRequestException('Cannot add self as friend');

    const user = await this.findOne(userId);

    const friend = await this.findOne(friendId);

    try {
      await this.userModel.updateOne(
        { _id: user._id },
        {
          $addToSet: { friends: friend._id },
        },
      );

      await this.userModel.updateOne(
        { _id: friend._id },
        {
          $addToSet: { friends: user._id },
        },
      );

      return { message: 'Friend added' };
    } catch (_error) {
      throw new InternalServerErrorException('Error adding friend');
    }
  }

  async getFriends(userId: string) {
    const user = await this.findOne(userId);

    const friends = await this.userModel.find({
      _id: {
        $in: user.friends,
      },
    });

    return friends;
  }

  async removeFriend(userId: string, friendId: string) {
    const user = await this.findOne(userId);

    if (user.friends.every((f) => f.toString() !== friendId))
      throw new BadRequestException(friendId + ' was not added as friends');

    const friend = await this.findOne(friendId);

    try {
      await this.userModel.updateOne(
        { _id: user._id },
        {
          $pull: {
            friends: friend._id,
          },
        },
      );

      await this.userModel.updateOne(
        {
          _id: friend._id,
        },
        {
          $pull: {
            friends: user._id,
          },
        },
      );

      return { message: 'Friend removed' };
    } catch (_error) {
      throw new InternalServerErrorException('Error removing friend');
    }
  }

  async blockUser(userId: string, blockedId: string) {
    if (userId === blockedId)
      throw new BadRequestException('Cannot block self');

    const user = await this.findOne(userId);

    const blocked = await this.findOne(blockedId);

    try {
      await this.userModel.updateOne(
        { _id: user._id },
        {
          $addToSet: { blockedUsers: blocked._id },
        },
      );

      return { message: 'Blocked user' };
    } catch (_error) {
      throw new InternalServerErrorException('Error blocking user');
    }
  }

  async getBlockList(userId: string) {
    const user = await this.findOne(userId);

    const blockList = await this.userModel.find({
      _id: {
        $in: user.blockedUsers,
      },
    });

    return blockList;
  }

  async unblockUser(userId: string, blockedId: string) {
    const user = await this.findOne(userId);

    if (user.blockedUsers.every((f) => f.toString() !== blockedId))
      throw new BadRequestException(blockedId + ' was never blocked');

    const blocked = await this.findOne(blockedId);

    try {
      await this.userModel.updateOne(
        { _id: user._id },
        {
          $pull: {
            blockedUsers: blocked._id,
          },
        },
      );

      return { message: 'User unblocked' };
    } catch (_error) {
      throw new InternalServerErrorException('Error unblocking friend');
    }
  }

  async pushAttendance(userId: string, eventId: string, probability: number) {
    const user = await this.findOne(userId);

    const result = await this.userModel.updateOne(
      { _id: user._id },
      {
        $addToSet: {
          attendance: {
            eventId,
            probability,
          },
        },
      },
    );

    return result.acknowledged;
  }

  async removeAttendance(userId: string, eventId: string) {
    const user = await this.findOne(userId);

    if (user.attendance.every((a) => a.eventId.toString() !== eventId))
      throw new BadRequestException(
        userId + ' was not attending the event ' + eventId,
      );

    const result = await this.userModel.updateOne(
      { _id: user._id },
      {
        $pull: {
          attendance: {
            eventId,
          },
        },
      },
    );

    return result.acknowledged;
  }
}
