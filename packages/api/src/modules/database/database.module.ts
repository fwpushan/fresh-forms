import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
const config = require('../../../ormconfig'); // eslint-disable-line
console.dir(config);
@Module({
  imports: [TypeOrmModule.forRoot(config)],
})
export class DatabaseModule {}
