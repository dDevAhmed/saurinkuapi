import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive } from "class-validator";

export class PaginationDto {

  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limits?: number = 10;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;
}