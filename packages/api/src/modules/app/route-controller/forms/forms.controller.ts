import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IUserToken, UserToken } from 'src/modules/auth';
import { FormService, SubmissionDto } from 'src/modules/forms';
import { SubmissionResponseDto } from 'src/modules/forms/models/submission.res.dto';

@Controller('forms')
export class FormsController {
  constructor(private readonly formService: FormService) {}
  @Get()
  async list() {
    return this.formService.list();
  }

  @Get(':formName')
  async getForm(@Param('formName') formName: string): Promise<any> {
    return this.formService.fetch(formName);
  }

  @Post(':formName/submission')
  async submitForm(
    @Param('formName') formName: string,
    @Body() body: SubmissionDto,
    @UserToken() info: IUserToken,
  ) {
    return this.formService.submitForm(formName, body.data, info.sub);
  }
}

@Controller('form-submission')
export class FormSubmissionController {
  constructor(private readonly formService: FormService) {}
  @Get()
  async allSubmissions(): Promise<SubmissionResponseDto[]> {
    return this.formService.getAllSubmission();
  }

  @Get(':id')
  async submission(@Param('id') id: string): Promise<any> {
    return this.formService.submissionData(id);
  }
}
