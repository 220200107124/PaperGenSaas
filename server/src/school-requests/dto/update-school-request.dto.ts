import { PartialType } from '@nestjs/mapped-types';
import { CreateSchoolRequestDto } from './create-school-request.dto';

export class UpdateSchoolRequestDto extends PartialType(CreateSchoolRequestDto) {}
