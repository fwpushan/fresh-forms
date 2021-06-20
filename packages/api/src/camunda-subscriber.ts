import { Client, Variables, logger } from 'camunda-external-task-client-js';
import { LoggerService } from 'src/modules/logger';
const { KeycloakAuthInterceptor } = require('camunda-external-task-client-js'); // eslint-disable-line

const kc = {
  url: process.env.KEYCLOAK_AUTH_URL,
  realm: process.env.KEYCLOAK_REALM,
};

export function bootstrapCamundaSub() {
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

  client.subscribe('processUserInput', async ({ task, taskService }) => {
    LoggerService.log(`Camunda processUserInput`, 'Camunda-sub');
    const variables = new Variables();
    variables.set('isRecursive', 'true');
    await taskService.complete(task, variables);
  });
  client.subscribe('makeRecursive', async ({ task, taskService }) => {
    LoggerService.log(`Camunda makeRecursive`, 'Camunda-sub');
    await taskService.complete(task);
  });
  LoggerService.log('Camunda client initiated', 'Camunda-sub');
}
