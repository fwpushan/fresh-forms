import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecordDataModel } from './record.entity';
import { Submission } from './submission.entity';

@Entity({
  name: 'tasks',
})
export class Task extends RecordDataModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'label',
    nullable: true,
  })
  label: string;

  @ManyToOne((type) => Submission, {
    eager: true,
    cascade: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'submission_id',
    referencedColumnName: 'id',
  })
  submission: Submission;
}
