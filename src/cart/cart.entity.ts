import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Order } from 'src/order/order.entity';
import { Product } from 'src/product/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @ManyToOne((_type) => Product, (product) => product.carts, {
    eager: false,
    cascade: true,
  })
  product: Product;

  @ManyToOne((_type) => Order, (order) => order.carts, {
    eager: false,
    cascade: true,
  })
  order: Order;

  @ManyToOne((_type) => User, (user) => user.carts, {
    eager: false,
    cascade: true,
  })
  @Exclude()
  user: User;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
