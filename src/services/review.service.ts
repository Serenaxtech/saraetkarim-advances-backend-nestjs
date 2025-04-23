import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../models/review.entity';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async getAllReviews(): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: ['customer', 'product'],
    });
  }

  async getReviewById(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { review_ID: id },
      relations: ['customer', 'product'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async getReviewsByCustomerId(customerId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { customer_ID: customerId },
      relations: ['product'],
    });
  }

  async getReviewsByProductId(productId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { product_ID: productId },
      relations: ['customer'],
    });
  }

  async createReview(customerId: number, reviewData: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create({
      ...reviewData,
      customer_ID: customerId,
    });
    return this.reviewRepository.save(review);
  }

  async updateReview(
    reviewId: number,
    customerId: number,
    reviewData: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { review_ID: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.customer_ID !== customerId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    Object.assign(review, reviewData);
    return this.reviewRepository.save(review);
  }

  async deleteReview(reviewId: number, customerId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { review_ID: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.customer_ID !== customerId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewRepository.remove(review);
  }
}