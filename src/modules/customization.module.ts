import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomizationController } from '../controllers/customization.controller';
import { CustomizationService } from '../services/customization.service';
import { Customization } from '../models/customization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customization])],
  controllers: [CustomizationController],
  providers: [CustomizationService],
  exports: [CustomizationService],
})
export class CustomizationModule {}