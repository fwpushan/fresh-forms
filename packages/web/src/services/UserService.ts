import ApiClient from "./http/ApiClient";

export class UserService {
  // Share Instance
  private static instance: UserService;

  public static get shared(): UserService {
    return this.instance || (this.instance = new this());
  }

  async checkUser(): Promise<string> {
    return await ApiClient.User.checkUser();
  }
}
