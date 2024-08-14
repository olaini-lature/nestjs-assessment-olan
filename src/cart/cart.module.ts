import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { PassportModule } from '@nestjs/passport';
import { ProductModule } from 'src/product/product.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ProductModule,
    AuthModule
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
