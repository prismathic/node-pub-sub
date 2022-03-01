import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { subscriber } from './subscriber';

@Entity()
export class topic {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @OneToMany(() => subscriber, (subscriber) => subscriber.topic)
  subscribers!: subscriber[];
}
