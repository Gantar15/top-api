import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { Model, Document, Types } from 'mongoose';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel('TopPage') private readonly topPageModel: Model<TopPageModel>,
  ) {}

  async create(
    dto: CreateTopPageDto,
  ): Promise<Document<unknown, {}, TopPageModel>> {
    return this.topPageModel.create(dto);
  }

  async updateById(
    id: string,
    dto: CreateTopPageDto,
  ): Promise<Document<unknown, {}, TopPageModel>> {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async deleteById(id: string): Promise<Document<unknown, {}, TopPageModel>> {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async findById(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async findByCategory(firstCategory: TopLevelCategory) {
    return this.topPageModel
      .find(
        { firstCategory },
        { alias: true, secondCategory: true, title: true },
      )
      .exec();
  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }
}
