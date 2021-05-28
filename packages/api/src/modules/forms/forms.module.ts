import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config';
import { Submission, User } from '../database';
import { LoggerModule } from '../logger';
import { FormService } from './form.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Submission]),
    ConfigModule,
    LoggerModule,
  ],
  providers: [FormService],
  exports: [FormService],
})
export class FormsModule {}
