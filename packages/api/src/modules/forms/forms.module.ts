import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config';
import { Submission, User } from '../database';
import { LoggerModule } from '../logger';
import { RuleEngineModule } from '../rule-engine';
import { FormService } from './form.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Submission]),
    ConfigModule,
    LoggerModule,
    RuleEngineModule,
  ],
  providers: [FormService],
  exports: [FormService],
})
export class FormsModule {}
