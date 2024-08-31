import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

class Application {
  public static async bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
  }
}

Application.bootstrap();