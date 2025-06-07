import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomLogger } from '@services/logger.service';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: new CustomLogger()
  });
  app.enableCors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || [] }); // TODO lock down the cors locations
  app.use(compression());
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('QuickBeans API')
    .setDescription('Collection of API endpoints for Cafe ordering project')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Enter JWT token bearer', in: 'header' }, 'JWT-auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
