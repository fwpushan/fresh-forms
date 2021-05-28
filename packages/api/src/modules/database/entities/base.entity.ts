import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * The base model class which includes basic timestamp columns and other common activities
 */
export abstract class BaseModel {
  /**
   * Time Columns
   */
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
