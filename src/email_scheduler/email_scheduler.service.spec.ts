import { Test, TestingModule } from '@nestjs/testing';
import { EmailSchedulerService } from './email_scheduler.service';

describe('EmailSchedulerService', () => {
  let service: EmailSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailSchedulerService],
    }).compile();

    service = module.get<EmailSchedulerService>(EmailSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
