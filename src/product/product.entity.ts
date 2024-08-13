import { Exclude } from 'class-transformer';
import { Category } from 'src/category/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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
  })
  @Exclude({ toPlainOnly: true })
  category: Category;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
