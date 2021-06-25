import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config';
import { Submission, User, Task } from '../database';
import { LoggerModule } from '../logger';
import { RuleEngineModule } from '../rule-engine';
import { FormService } from './form.service';
import { TaskService } from './task/task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Submission, Task]),
    ConfigModule,
    LoggerModule,
    RuleEngineModule,
  ],
  providers: [FormService, TaskService],
  exports: [FormService, TaskService],
})
export class FormsModule {}
