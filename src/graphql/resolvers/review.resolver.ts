import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ReviewType } from '../types/review.type';
import { CreateReviewInput, UpdateReviewInput } from '../types/review-input.type';
import { ReviewService } from '../../services/review.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Resolver(() => ReviewType)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query(() => [ReviewType])
  async reviews(): Promise<ReviewType[]> {
    return this.reviewService.getAllReviews();
  }

  @Query(() => ReviewType)
  async review(@Args('id', { type: () => Int }) id: number): Promise<ReviewType> {
    return this.reviewService.getReviewById(id);
  }

  @Query(() => [ReviewType])
  async productReviews(
    @Args('productId', { type: () => Int }) productId: number
  ): Promise<ReviewType[]> {
    return this.reviewService.getReviewsByProductId(productId);
  }

  @Mutation(() => ReviewType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1)
  async createReview(
    @Args('input') createReviewInput: CreateReviewInput,
    @Context() context: any
  ): Promise<ReviewType> {
    return this.reviewService.createReview(
      context.req.user.id,
      createReviewInput
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async deleteReview(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: any
  ): Promise<boolean> {
    await this.reviewService.deleteReview(id, context.req.user.id);
    return true;
  }

  // Add this mutation to the ReviewResolver class
  
  @Mutation(() => ReviewType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1)
  async updateReview(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateReviewInput: UpdateReviewInput,
    @Context() context: any
  ): Promise<ReviewType> {
    return this.reviewService.updateReview(
      id,
      context.req.user.id,
      updateReviewInput
    );
  }

  
  @Query(() => [ReviewType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async customerReviews(
    @Args('customerId', { type: () => Int }) customerId: number
  ): Promise<ReviewType[]> {
    return this.reviewService.getReviewsByCustomerId(customerId);
  }
}