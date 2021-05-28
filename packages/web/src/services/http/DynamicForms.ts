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
}
