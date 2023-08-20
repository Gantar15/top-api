import { Injectable } from '@nestjs/common';
import { ReviewModel } from './review.model';
import { Model, Document, Types } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<ReviewModel>,
  ) {}

  async create(
    dto: CreateReviewDto,
  ): Promise<Document<unknown, {}, ReviewModel>> {
    return this.reviewModel.create(dto);
  }

  async delete(id: string): Promise<Document<unknown, {}, ReviewModel>> {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }

  async findByProductId(productId: string) {
    return this.reviewModel
      .find({ productId: new Types.ObjectId(productId) })
      .exec();
  }

  async deleteByProductId(productId: string) {
    return this.reviewModel
      .deleteMany({ productId: new Types.ObjectId(productId) })
      .exec();
  }
}
