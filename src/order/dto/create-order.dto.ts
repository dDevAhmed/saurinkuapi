import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';


export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  description: string;

  @IsOptional()
  // @IsDate()
  pickupTime?: string;

  @IsOptional()
  // @IsDate()
  deliveryTime?: string;

  @IsOptional()
  // @IsDate()
  pickupDate?: string;

  @IsOptional()
  // @IsDate()
  deliveryDate?: string;
}


// import { IsString, IsDate, IsNotEmpty } from 'class-validator';
// import { Transform } from 'class-transformer';

// export class CreateOrderDto {
//   @IsString()
//   @IsNotEmpty()
//   description: string;

//   @Transform(({ value }) => {
//     const [time, period] = value.trim().split(/(am|pm)/i);
//     const [hours, minutes] = time.split(':').map(Number);
//     const finalHours = period.toLowerCase() === 'pm' && hours !== 12 ? hours + 12 : hours;
//     return new Date(0, 0, 0, finalHours, minutes);
//   })
//   @IsDate()
//   @IsNotEmpty()
//   pickupTime: Date;

//   @Transform(({ value }) => {
//     const [time, period] = value.trim().split(/(am|pm)/i);
//     const [hours, minutes] = time.split(':').map(Number);
//     const finalHours = period.toLowerCase() === 'pm' && hours !== 12 ? hours + 12 : hours;
//     return new Date(0, 0, 0, finalHours, minutes);
//   })
//   @IsDate()
//   @IsNotEmpty()
//   deliveryTime: Date;

//   @Transform(({ value }) => {
//     const [day, month, year] = value.trim().split('/').map(Number);
//     return new Date(year, month - 1, day);
//   })
//   @IsDate()
//   @IsNotEmpty()
//   pickupDate: Date;

//   @Transform(({ value }) => {
//     const [day, month, year] = value.trim().split('/').map(Number);
//     return new Date(year, month - 1, day);
//   })
//   @IsDate()
//   @IsNotEmpty()
//   deliveryDate: Date;
// }



