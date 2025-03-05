import { PartialType } from '@nestjs/mapped-types';
import { RegisterDTO, LoginDTO } from '../dto/create-auth.dto';

export class UpdateAuthDto extends PartialType(RegisterDTO) {}
