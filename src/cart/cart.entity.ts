import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Product } from 'src/product/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @ManyToOne((_type) => Product, (product) => product.carts, { eager: false, cascade: true })
  @JoinColumn({
    name: 'productId'
  })
  product: Product;

  @ManyToOne((_type) => User, (user) => user.carts, { eager: false, cascade: true })
  @JoinColumn({
    name: 'userId'
  })
  @Exclude()
  user: User;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
