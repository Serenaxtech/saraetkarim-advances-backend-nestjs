import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './modules/customer.module';
import { AddressModule } from './modules/address.module';
import { ReviewModule } from './modules/review.module';
import { ProductModule } from './modules/product.module';
import { CategoryModule } from './modules/category.module';
import { CustomizationModule } from './modules/customization.module';
import { CartModule } from './modules/cart.module';
import { OrderModule } from './modules/order.module';
import { ShipmentModule } from './modules/shipment.module';
import databaseConfig from './config/database.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // Set this to false initially
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    CustomerModule,
    AddressModule,
    ReviewModule,
    ProductModule,
    CategoryModule,
    CustomizationModule,
    CartModule,
    OrderModule,
    ShipmentModule,
    AuthModule,
  ],
})
export class AppModule {}
