import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/modules/auth';
import { ConfigService } from 'src/modules/config';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @Public()
  async config() {
    return this.configService.getConfig();
  }
}
