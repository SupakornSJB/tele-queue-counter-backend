import { Test, TestingModule } from '@nestjs/testing';
import { TrafficGateway } from './traffic.gateway';

describe('TrafficGateway', () => {
  let gateway: TrafficGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrafficGateway],
    }).compile();

    gateway = module.get<TrafficGateway>(TrafficGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
