import "reflect-metadata";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import type { Request, Response } from "express";

async function bootstrap(): Promise<void> {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Express instance for healthcheck & root redirect to Apollo Sandbox
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      service: "developer-card-graphql",
      graphqlEndpoint: "/graphql",
      timestamp: new Date().toISOString(),
    });
  });

  httpAdapter.get("/", (_req: Request, res: Response) => {
    res.redirect("/graphql");
  });

  const port = Number(process.env.PORT || 3000);
  await app.listen(port, "0.0.0.0");

  logger.log(`Developer Digital Business Card API running on port ${port}`);
  logger.log(`Apollo Sandbox GraphQL IDE: http://localhost:${port}/graphql`);
}

void bootstrap();
