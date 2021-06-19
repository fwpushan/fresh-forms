import { Module } from '@nestjs/common';
import { ConfigModule } from '../config';
import { LoggerModule } from '../logger';
import { RuleEngineService } from './rule-engine.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [RuleEngineService],
  exports: [RuleEngineService],
})
export class RuleEngineModule {}
