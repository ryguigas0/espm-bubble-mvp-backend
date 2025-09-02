import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getVersion(): string {
    return this.configService.get<string>('VERSION') || 'NO_VERSION_SET';
  }
}
