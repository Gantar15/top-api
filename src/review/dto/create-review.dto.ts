import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Max(5, { message: 'Значение рейтинга должно быть меньше 6' })
  @Min(1, { message: 'Значение рейтинга должно быть больше 0' })
  @IsNumber()
  rating: number;

  @IsString()
  productId: string;
}
