import { SubmissionData } from 'src/types/submission.data';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecordDataModel } from './record.entity';
import { User } from './user.entity';

@Entity({
  name: 'submissions',
})
export class Submission extends RecordDataModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'data',
    type: 'jsonb',
  })
  data: SubmissionData;

  @ManyToOne((type) => User, {
    eager: true,
    cascade: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User;
}
