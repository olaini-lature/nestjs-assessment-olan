import { Exclude } from 'class-transformer';
import { Cart } from 'src/cart/cart.entity';
import { Category } from 'src/category/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  price: number;

  @ManyToOne((_type) => Category, (category) => category.products, {
    eager: false,
    cascade: true,
  })
  @Exclude({ toPlainOnly: true })
  category: Category;

  @OneToMany((_type) => Cart, (cart) => cart.product, { eager: false })
  carts: Cart[];

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
