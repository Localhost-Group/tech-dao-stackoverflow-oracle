import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TagsService } from './services/stack-tags.service';
import { UserService } from './services/stack-user.service';
import { StackService } from './services/stackService.service';
import { StackTokensController } from './stack-tokens.controller';
@Module({
  imports: [
    ConfigModule,
    HttpModule,
    ClientsModule.register([
      {
        name: 'Tokens_Service',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@rabbitmq:5672'],
          queue: 'stack-auth',
        },
      },
    ]),
  ],
  controllers: [StackTokensController],
  providers: [StackService, UserService, TagsService],
})
export class StackTokensModule {}
