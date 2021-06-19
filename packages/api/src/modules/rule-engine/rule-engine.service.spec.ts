require('../../../env_setup');
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../config/config.service';
import { RuleEngineService } from './rule-engine.service';

describe('RuleEngineService', () => {
  let service: RuleEngineService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RuleEngineService, ConfigService],
    }).compile();

    service = module.get<RuleEngineService>(RuleEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
