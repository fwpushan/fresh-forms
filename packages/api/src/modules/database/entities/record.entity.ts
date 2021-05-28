import { JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from './base.entity';
import { User } from './user.entity';

/**
 * Abstract class to model a record element which has four audit columns. Creator and Modifier columns are specified here and it includes time stamp columns form BaseModel
 */
export abstract class RecordDataModel extends BaseModel {
  @ManyToOne((type) => User, { eager: false })
  @JoinColumn({
    name: 'creator',
    referencedColumnName: 'id',
  })
  creator: User;
  @ManyToOne((type) => User, { eager: false })
  @JoinColumn({
    name: 'modifier',
    referencedColumnName: 'id',
  })
  modifier: User;
}
