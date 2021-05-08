import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { StackService } from './services/stackService.service';

@Controller('stack-tokens')
export class StackTokensController {
  constructor(private readonly stackService: StackService) {}

  @EventPattern('stack_token')
  async handleCollectingData(data: any): Promise<void> {
    const res = await this.stackService.handleGeneretingStackTokens(data);
    console.log(res);
  }
}
