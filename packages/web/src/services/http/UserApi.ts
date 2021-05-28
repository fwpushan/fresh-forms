import HttpBaseClient from "./common/HttpBaseClient";

export class UserApi extends HttpBaseClient {
  public async checkUser(): Promise<string> {
    try {
      const response = await this.apiClient.get(
        "users/check-user",
        this.addAuthHeader(),
      );
      return response.data as string;
    } catch (error) {
      this.handleRequestError(error);
      throw error;
    }
  }
}
