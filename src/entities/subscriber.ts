import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { topic } from './topic';

@Entity()
export class subscriber {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => topic, (topic) => topic.subscribers)
  topic!: topic;
}
