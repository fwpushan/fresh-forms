import { Controller, Get } from '@nestjs/common';
import { FormService } from '../forms';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly formService: FormService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('lake-location')
  async locations() {
    const lakes = (await this.formService.getAllLakes()) as {
      lakeName: string;
    }[];
    return {
      lakes: lakes.map((lake) => lake.lakeName),
    };
  }
}
