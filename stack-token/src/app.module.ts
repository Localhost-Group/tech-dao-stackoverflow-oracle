import { Module } from '@nestjs/common';
import { StackTokensModule } from './stack-tokens/stack-tokens.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [StackTokensModule, ConfigModule.forRoot()],
})
export class AppModule {}
