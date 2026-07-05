import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RpcExceptionFilter } from './common/filters/rpc-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new RpcExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // exceptionFactory: (errors: ValidationError[]) => {
      //   const message = errors.flatMap((error) =>
      //     Object.values(error.constraints ?? {}),
      //   );

      //   return new RpcException({
      //     statusCode: HttpStatus.BAD_REQUEST,
      //     error: 'Bad Request',
      //     message,
      //   });
      // },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('DOL API Gateway')
    .setDescription(
      'Centralized API Specification for Department of Lands Services',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Swagger UI available at: http://localhost:${port}/api/docs`);
}
bootstrap().catch((e) => console.error(e));
