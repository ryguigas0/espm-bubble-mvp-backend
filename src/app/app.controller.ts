import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from 'src/auth/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getVersion(): string {
    return this.appService.getVersion();
  }
}
