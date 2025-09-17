import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module.js";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

const port = Number(process.env.API_PORT || 4000);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: ["http://localhost:8080", "http://localhost:3000"], credentials: true });
  app.use(helmet({ contentSecurityPolicy: false }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle("F1 League API")
    .setDescription("Public read-only API v1 + admin controls")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, documentFactory);

  await app.listen(port, "0.0.0.0");
  console.log(`API listening on :${port}`);
}
bootstrap();
