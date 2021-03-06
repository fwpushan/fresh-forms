import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  FormsConfig,
  DryRunSubmissionResult,
  SubmissionResult,
} from '../../types';
import { ConfigService } from '../config/config.service';
import axios from 'axios';
import { LoggerService } from '../logger/logger.service';
import { Repository } from 'typeorm';
import { Submission, User } from '../database';
import { SubmissionResponseDto } from './models/submission.res.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RuleEngineService } from '../rule-engine';

// Expected header name to send the authorization token to formio API.
const FORMIO_TOKEN_NAME = 'x-jwt-token';

@Injectable()
export class FormService {
  constructor(
    private readonly configService: ConfigService,
    private readonly ruleEngine: RuleEngineService,
    private readonly logger: LoggerService,
    @InjectRepository(Submission)
    private readonly submissionRepo: Repository<Submission>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  get config(): FormsConfig {
    return this.configService.getConfig().forms;
  }

  /**
   * Get a form definition from formio.
   * @param formName Name of the form to be retrieved.
   * @returns Form definition.
   */
  async fetch(formName: string) {
    const authHeader = await this.createAuthHeader();
    const content = await axios.get(
      `${this.config.formsUrl}/${formName}`,
      authHeader,
    );
    return content.data;
  }

  /**
   * Lists form definitions that contains the tag 'common'.
   */
  async list() {
    return (
      await axios.get(`${this.config.formsUrl}/form?type=form&tags=common`)
    ).data;
  }

  /**
   * Drys run submission allows the data to be validated by Formio API and also to
   * returned a processed data model more close to what would be saved on Formio.
   * For instance, formio allows that the form elements be defined to not be stored
   * on the server side, this kind of validations will be applied during this
   * API call and the result will be the data after processed by formio.
   * Please note that the data will not be saved on formio database.
   * @param formName Name of the form to be validated.
   * @param data Data to be validated/processed.
   * @returns Status indicating if the data being submitted is valid or not
   * alongside with the data after formio procecessing.
   */
  async dryRunSubmission(
    formName: string,
    data: any,
  ): Promise<DryRunSubmissionResult> {
    try {
      const authHeader = await this.createAuthHeader();
      const submissionResponse = await axios.post(
        `${this.config.formsUrl}/${formName}/submission?dryrun=1`,
        { data },
        authHeader,
      );
      return { valid: true, data: submissionResponse.data };
    } catch (error) {
      if (error.response.status === HttpStatus.BAD_REQUEST) {
        return { valid: false };
      }
      throw error;
    }
  }

  async runWorkflow(formName: string, submissionId: string, data: any) {
    // 3. Now check associated workflow
    const formDef: any = await this.fetch(formName);
    if (formDef._id) {
      // 3a. Get form association
      const result: any[] = await this.submissionRepo.query(
        'SELECT * from form_process_mapper WHERE form_id=$1',
        [formDef._id],
      );
      if (result && result.length > 0) {
        const processKey = result[0].process_key;
        try {
          this.logger.log(`Submitting to work flow: ${processKey}`);
          await this.ruleEngine.start(processKey, {
            submissionId,
            ...data,
          });
        } catch (error) {
          this.logger.error(
            `Unable to start workflow: For error: ${error}`,
            'FormService',
          );
        }
      }
    }
  }

  async submitForm(
    formName: string,
    data: any,
    userId: string,
  ): Promise<string> {
    // 1. Validate
    await this.dryRunSubmission(formName, data);
    // 2. Get user
    const user = await this.userRepo.findOneOrFail({
      userId,
    });
    // 2. Save in db
    const submission: Submission = this.submissionRepo.create();
    submission.user = user;
    submission.data = {
      formData: data,
      formName,
      info: {},
    };
    await this.submissionRepo.save(submission);
    await this.runWorkflow(formName, submission.id, {});
    return submission.id;
  }

  async editFormSubmission(
    id: string,
    formName: string,
    data: any,
    userId: string,
  ): Promise<string> {
    // 1. Validate
    await this.dryRunSubmission(formName, data);
    // 2. Get user
    const user = await this.userRepo.findOneOrFail({
      userId,
    });
    // 3. Submission
    const submission = await this.submissionRepo.findOneOrFail(id);
    if (submission.data.formName !== formName) {
      throw new UnprocessableEntityException(
        `Form name mismatch ${formName} requested and existing ${submission.data.formName}`,
      );
    }
    submission.data = {
      formData: data,
      formName,
      info: {
        previous: submission.data.formData,
      },
    };
    submission.modifier = user;
    await this.submissionRepo.save(submission);
    await this.runWorkflow(formName, submission.id, {});
    return submission.id;
  }

  async getAllSubmission(): Promise<SubmissionResponseDto[]> {
    const results: Submission[] = await this.submissionRepo.find({
      order: {
        updatedAt: 'DESC',
      },
    });
    const returnValues: SubmissionResponseDto[] = results.map((submission) => ({
      id: submission.id,
      data: submission.data.formData,
      userName: submission.user.name,
      createdAt: submission.createdAt,
      updateAt: submission.updatedAt,
      formName: submission.data.formName,
    }));
    return returnValues;
  }

  async submissionData(id: string): Promise<SubmissionResponseDto> {
    const submission = await this.submissionRepo.findOne(id);
    return {
      id: submission.id,
      data: submission.data.formData,
      userName: submission.user.name,
      createdAt: submission.createdAt,
      updateAt: submission.updatedAt,
      formName: submission.data.formName,
    };
  }

  /**
   * Validate and save the data to the From IO environment generating also
   * the absolute path for the formio generated submission.
   * @param formName Name of the form to be saved.
   * @param data Data to be saved.
   * @returns Submission related information from formio submission result.
   */
  async submission(formName: string, data: any): Promise<SubmissionResult> {
    try {
      const authHeader = await this.createAuthHeader();
      const response = await axios.post(
        `${this.config.formsUrl}/${formName}/submission`,
        { data },
        authHeader,
      );
      const absolutePath = `${this.config.formsUrl}/form/${response.data.form}/submission/${response.data._id}`;
      return {
        submissionId: response.data._id,
        state: response.data.state,
        data: response.data.data,
        formId: response.data.form,
        absolutePath,
        valid: true,
      };
    } catch (error) {
      if (error.response.status === HttpStatus.BAD_REQUEST) {
        return { valid: false } as SubmissionResult;
      }
      this.logger.error(
        `Error while executing the submission of the form ${formName}`,
      );
      throw error;
    }
  }

  async getAllLakes() {
    const allLakeSubmission: Submission[] = await this.submissionRepo
      .createQueryBuilder('submissions')
      .where(`submissions.data->>'formName' = :formName`, {
        formName: 'lakeform',
      })
      .getMany();

    return allLakeSubmission.map((item) => item.data.formData);
  }

  /**
   * Creates the expected authorization header to authorize the formio API.
   * @returns header to be added to HTTP request.
   */
  private async createAuthHeader() {
    const token = await this.getAuthToken();
    return {
      headers: {
        [FORMIO_TOKEN_NAME]: token,
      },
    };
  }

  /**
   * Gets the authentication token value to authorize the formio API.
   * @returns the token that is needed to authentication on the formio API.
   */
  private async getAuthToken() {
    // TODO: Cache the token ultil it expires and just request a new one
    // when there is no token in the cache or it is about to expire.
    const authResponse = await this.getUserLogin();
    return authResponse.headers[FORMIO_TOKEN_NAME];
  }

  /**
   * Executes the authentication on formio API.
   * @returns the result of a sucessfull authentication or thows an expection
   * in case the result is anything different from HTTP 200 code.
   */
  private async getUserLogin() {
    try {
      const authRequest = await axios.post(
        `${this.config.formsUrl}/user/login`,
        {
          data: {
            email: this.config.serviceAccountCredential.userName,
            password: this.config.serviceAccountCredential.password,
          },
        },
      );

      return authRequest;
    } catch (excp) {
      this.logger.error(`Received exception while getting form SA token`);
      this.logger.error(
        `${JSON.stringify(
          {
            status: excp.response.status,
            statusText: excp.response.statusText,
            data: excp.response.data,
          },
          null,
          2,
        )}`,
      );
      throw excp;
    }
  }
}
