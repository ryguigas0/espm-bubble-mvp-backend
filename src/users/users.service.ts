import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

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
        throw new NotFoundException('User not found!');
      }

      return user;
    } catch (_error) {
      throw new BadRequestException('Invalid ID');
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({
        email: email,
      });

      return user;
    } catch (_error) {
      throw new BadRequestException('Invalid email');
    }
  }

  // update(id: string, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
