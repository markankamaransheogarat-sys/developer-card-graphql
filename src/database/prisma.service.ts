import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private connected = false;

  constructor() {
    super({
      log:
        process.env.DEBUG_SQL === "true"
          ? ["query", "info", "warn", "error"]
          : ["warn", "error"],
    });
  }

  public isDatabaseConnected(): boolean {
    return this.connected;
  }

  public async onModuleInit(): Promise<void> {
    if (!process.env.DATABASE_URL) {
      this.logger.warn(
        "DATABASE_URL is not set — operating in zero-config in-memory fallback mode.",
      );
      this.connected = false;
      return;
    }

    try {
      await this.$connect();
      this.connected = true;
      this.logger.log("Successfully connected to PostgreSQL via Prisma ORM.");
    } catch (error) {
      this.connected = false;
      this.logger.warn(
        `PostgreSQL connection unavailable (${(error as Error).message}). Activating resilient in-memory store fallback.`,
      );
    }
  }

  public async onModuleDestroy(): Promise<void> {
    if (this.connected) {
      await this.$disconnect();
    }
  }
}
