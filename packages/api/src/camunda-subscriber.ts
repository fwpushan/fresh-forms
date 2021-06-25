import { NestExpressApplication } from '@nestjs/platform-express';
import { Client, Variables, logger } from 'camunda-external-task-client-js';
import { LoggerService } from 'src/modules/logger';
import { FormService, TaskService } from './modules/forms';
const { KeycloakAuthInterceptor } = require('camunda-external-task-client-js'); // eslint-disable-line

const kc = {
  url: process.env.KEYCLOAK_AUTH_URL,
  realm: process.env.KEYCLOAK_REALM,
};

export function bootstrapCamundaSub(app: NestExpressApplication) {
  const keycloakAuthentication = new KeycloakAuthInterceptor({
    tokenEndpoint: `${kc.url}realms/${kc.realm}/protocol/openid-connect/token`,
    clientId: process.env.KEYCLOAK_BPM_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_BPM_CLIENT_SECRET,
  });

  const client = new Client({
    baseUrl: process.env.BPM_URL,
    interceptors: keycloakAuthentication,
    use: logger,
  });

  const formService = app.get<FormService>(FormService);
  const appTaskService = app.get<TaskService>(TaskService);

  client.subscribe('processUserInput', async ({ task, taskService }) => {
    LoggerService.log(`Camunda processUserInput`, 'Camunda-sub');
    let recursive = 'false';
    // Get submission Id
    const submissionId = task.variables.get('submissionId');
    if (submissionId) {
      const submission = await formService.submissionData(submissionId);
      if (submission && submission.data?.isRecursiveProcess) {
        recursive = 'true';
      }
    }
    const variables = new Variables();
    variables.set('isRecursive', recursive);
    await taskService.complete(task, variables);
  });
  client.subscribe('makeRecursive', async ({ task, taskService }) => {
    LoggerService.log(`Camunda makeRecursive`, 'Camunda-sub');
    const variables = new Variables();
    const submissionId = task.variables.get('submissionId');
    if (submissionId) {
      // Check task available or not
      let submissionTask = await appTaskService.getTask(submissionId);
      if (submissionTask) {
        variables.set('alreadyExists', true);
      } else {
        submissionTask = await appTaskService.createTask(submissionId);
        variables.set('alreadyExists', false);
      }

      variables.set('submissionTaskId', submissionTask.id);
      variables.set('taskLabel', submissionTask.label);
    }
    await taskService.complete(task, variables);
  });
  LoggerService.log('Camunda client initiated', 'Camunda-sub');
}
