import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({
    name: 'user_id',
  })
  userId: string;

  @Column({
    name: 'user_name',
  })
  userName: string;

  @Column({
    name: 'name',
  })
  name: string;
}
