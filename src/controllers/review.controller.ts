import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @Roles(0)
  async getAllReviews() {
    return this.reviewService.getAllReviews();
  }

  @Get(':id')
  @Roles(0, 1)
  async getReviewById(@Param('id') id: number) {
    return this.reviewService.getReviewById(id);
  }

  @Get('customer/:customerId')
  @Roles(0, 1)
  async getReviewsByCustomerId(@Param('customerId') customerId: number, @Request() req) {
    const targetId = req.user.role === 0 ? customerId : req.user.id;
    return this.reviewService.getReviewsByCustomerId(targetId);
  }

  @Get('product/:productId')
  @Roles(0, 1)
  async getReviewsByProductId(@Param('productId') productId: number) {
    return this.reviewService.getReviewsByProductId(productId);
  }

  @Post()
  @Roles(0, 1)
  async createReview(@Body() reviewData: CreateReviewDto, @Request() req) {
    return this.reviewService.createReview(req.user.id, reviewData);
  }

  @Put(':id')
  @Roles(0, 1)
  async updateReview(
    @Param('id') id: number,
    @Body() reviewData: UpdateReviewDto,
    @Request() req,
  ) {
    return this.reviewService.updateReview(id, req.user.id, reviewData);
  }

  @Delete(':id')
  @Roles(0, 1)
  async deleteReview(@Param('id') id: number, @Request() req) {
    await this.reviewService.deleteReview(id, req.user.id);
    return { message: 'Review deleted successfully' };
  }
}