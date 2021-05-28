import { ConfigApi } from "./ConfigApi";
import { UserApi } from "./UserApi";
import { DynamicFormsApi } from "./DynamicForms";
import { WorkflowApi } from "./WorkflowApi";

const ApiClient = {
  Configs: new ConfigApi(),
  User: new UserApi(),
  DynamicForms: new DynamicFormsApi(),
  Workflow: new WorkflowApi(),
};

export default ApiClient;
