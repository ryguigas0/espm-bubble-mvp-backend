import { OmitType } from '@nestjs/mapped-types';
import { User } from '../schema/user.schema';

export class UserDto extends OmitType(User, ['passwordHash'] as const) {
  id: string;

  constructor(id: string, user: User) {
    super();

    this.id = id;
    this.name = user.name;
    this.email = user.email;
    this.region = user.region;
    this.profileImageURL = user.profileImageURL;
    this.coords = user.coords;
    this.embeddings = user.embeddings;
    this.attendance = user.attendance;
    this.blockedUsers = user.blockedUsers;
    this.friends = user.friends;
    this.deletedAt = user.deletedAt;
  }
}
