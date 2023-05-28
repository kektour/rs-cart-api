import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  cartId: string;

  @Column({ type: 'json', nullable: false })
  payment: string;

  @Column({ type: 'json', nullable: false })
  delivery: string;

  @Column({ type: 'text', nullable: false })
  comments: string;

  @Column({ type: 'text', nullable: false })
  status: string;

  @Column({ type: 'integer', nullable: true })
  total: number;
}
