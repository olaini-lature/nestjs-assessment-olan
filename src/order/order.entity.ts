import { Cart } from 'src/cart/cart.entity';
import { OrderStatus } from 'src/shared/enums/order-status.enum';
import { PaymentMethod } from 'src/shared/enums/payment-method.enum';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  price_total: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.BANK_TRANSFER
  })
  payment: PaymentMethod;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.ON_PROCESS,
  })
  status: OrderStatus;

  @OneToMany((_type) => Cart, (cart) => cart.order, { eager: false })
  carts: Cart[];

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}