import { FormSubmissionContract } from "@/types/contracts/SubmissionContact";
import HttpBaseClient from "./common/HttpBaseClient";

const pathName = "forms";

export class DynamicFormsApi extends HttpBaseClient {
  public async getFormDefinition(formName: string): Promise<any> {
    try {
      return await this.apiClient.get(
        `${pathName}/${formName}`,
        this.addAuthHeader(),
      );
    } catch (error) {
      this.handleRequestError(error);
      throw error;
    }
  }

  public async getFormAdditionalData(url: string) {
    try {
      return await this.apiClient.get(url, this.addAuthHeader());
    } catch (error) {
      this.handleRequestError(error);
      throw error;
    }
  }

  public async getFormlist(): Promise<any> {
    try {
      return await this.apiClient.get(pathName, this.addAuthHeader());
    } catch (error) {
      this.handleRequestError(error);
      throw error;
    }
  }

  async submitForm(formName: string, data: any) {
    try {
      return await this.apiClient.post(
        `${pathName}/${formName}/submission`,
        data,
        this.addAuthHeader(),
      );
    } catch (error) {
      this.handleRequestError(error);
      throw error;
    }
  }

  async updateSubmission(id: string, formName: string, data: any) {
    try {
      return await this.apiClient.patch(
        `${pathName}/${formName}/submission/${id}`,
        data,
        this.addAuthHeader(),
      );
    } catch (error) {
      this.handleRequestError(error);
      throw error;
    }
  }

  async submissions(): Promise<FormSubmissionContract[]> {
    try {
      const response: FormSubmissionContract[] = (
        await this.apiClient.get(`form-submission`, this.addAuthHeader())
      ).data as FormSubmissionContract[];
      return response;
    } catch (error) {
      this.handleRequestError(error);
      throw error;
    }
  }

  async submission(id: string): Promise<FormSubmissionContract> {
    try {
      const response: FormSubmissionContract = (
        await this.apiClient.get(`form-submission/${id}`, this.addAuthHeader())
      ).data as FormSubmissionContract;
      return response;
    } catch (error) {
      this.handleRequestError(error);
      throw error;
    }
  }
}
