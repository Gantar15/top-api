import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { IdValidationPipe } from 'src/pipes/id-validation-pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { TOP_PAGE_NOT_FOUND } from './top-page.constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const doc = await this.topPageService.findById(id);
    if (!doc) {
      throw new HttpException(TOP_PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return doc;
  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const doc = await this.topPageService.findByAlias(alias);
    if (!doc) {
      throw new HttpException(TOP_PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return doc;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.topPageService.deleteById(id);
    if (!deletedDoc) {
      throw new HttpException(TOP_PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return deletedDoc;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const updatedDoc = await this.topPageService.updateById(id, dto);
    if (!updatedDoc) {
      throw new HttpException(TOP_PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return updatedDoc;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() { firstCategory }: FindTopPageDto) {
    const doc = await this.topPageService.findByCategory(firstCategory);
    return doc;
  }
}
