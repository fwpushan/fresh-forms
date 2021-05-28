import { IsNotEmpty } from 'class-validator';

export class SubmissionDto {
  @IsNotEmpty()
  data: any;
}
