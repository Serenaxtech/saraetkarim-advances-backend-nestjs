import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressController } from '../controllers/address.controller';
import { AddressService } from '../services/address.service';
import { Address } from '../models/address.entity';
import { AddressResolver } from '../graphql/resolvers/address.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  controllers: [AddressController],
  providers: [AddressService, AddressResolver],
  exports: [AddressService],
})
export class AddressModule {}