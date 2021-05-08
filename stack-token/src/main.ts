import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@rabbitmq:5672'],
      queue: 'stack-auth',
      queueOptions: {
        durable: false,
        noAck: false,
      },
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(3030);
}
bootstrap();
