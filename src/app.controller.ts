import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailSchedulerService } from './email_scheduler/email_scheduler.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailScheduler: EmailSchedulerService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test/dailymail')
  testDaily() {
    this.emailScheduler.sendDailyForecastToAll();
    return "Completed!";
  }
}
