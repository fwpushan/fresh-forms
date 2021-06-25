import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { WorkflowConfig } from '../../types';
import { ConfigService } from '../config/config.service';
import { KeycloakService } from 'src/modules/auth';
import { LoggerService } from '../logger';
import { exists } from 'fs';

@Injectable()
export class RuleEngineService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  private createRuleEngineVariables(payload: any) {
    const variables = Object.keys(payload).reduce((existing: any, key) => {
      return {
        ...existing,
        [key]: { value: `${payload[key]}`, type: 'string' },
      };
    }, {});

    return {
      variables,
    };
  }

  private async token() {
    return (
      await KeycloakService.shared.getTokenFromClientSecret(
        process.env.KEYCLOAK_BPM_CLIENT_ID,
        process.env.KEYCLOAK_BPM_CLIENT_SECRET,
      )
    ).access_token;
  }

  get config(): WorkflowConfig {
    return this.configService.getConfig().workflow;
  }

  workflowUrl(flowName: string, operation: string) {
    return `${this.config.ruleEngineUrl}/process-definition/key/${flowName}/${operation}`;
  }

  async start(name: string, payload: any) {
    const startURL = this.workflowUrl(name, 'start');
    const token = await this.token();
    return axios.post(startURL, this.createRuleEngineVariables(payload), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
