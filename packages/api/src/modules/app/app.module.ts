import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { ConfigModule } from '../config';
import { DatabaseModule } from '../database';
import { LoggerModule } from '../logger';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigController } from './route-controller/config/config.controller';
import { UserController } from './route-controller/user/user.controller';
import {
  FormsController,
  FormSubmissionController,
} from './route-controller/forms/forms.controller';
import { FormsModule } from '../forms';
import { RuleEngineModule } from '../rule-engine';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    ConfigModule,
    AuthModule,
    UserModule,
    FormsModule,
    RuleEngineModule,
  ],
  controllers: [
    AppController,
    ConfigController,
    UserController,
    FormsController,
    FormSubmissionController,
  ],
  providers: [AppService],
})
export class AppModule {}
