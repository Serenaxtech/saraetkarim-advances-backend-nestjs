import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from '../controllers/review.controller';
import { ReviewService } from '../services/review.service';
import { Review } from '../models/review.entity';
import { ReviewResolver } from '../graphql/resolvers/review.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewResolver],
  exports: [ReviewService],
})
export class ReviewModule {}