import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { KONSTANTIN_PROFILE_SEED } from "./seed-data";

/**
 * Automatically verifies and populates the PostgreSQL database on application boot.
 * Guarantees that `docker compose up` or a fresh cloud deployment immediately
 * has Konstantin's complete profile, skills, experience, and projects seeded.
 */
@Injectable()
export class DatabaseInitializerService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseInitializerService.name);

  constructor(private readonly prisma: PrismaService) {}

  public async onModuleInit(): Promise<void> {
    if (!this.prisma.isDatabaseConnected()) {
      this.logger.log(
        "In-memory seed store initialized with Konstantin's canonical profile data.",
      );
      return;
    }

    try {
      const existingCount = await this.prisma.profile.count();
      if (existingCount > 0) {
        this.logger.log(
          `PostgreSQL database already contains ${existingCount} profile(s) — skipping initial auto-seed.`,
        );
        return;
      }

      this.logger.log(
        "Empty database detected on startup — executing automatic transactional seed...",
      );
      await this.seedPrimaryProfile();
      this.logger.log(
        "PostgreSQL database automatically seeded with Konstantin's profile, skills, experience & projects.",
      );
    } catch (error) {
      this.logger.error(
        `Automatic database seed failed: ${(error as Error).message}`,
      );
    }
  }

  public async seedPrimaryProfile(): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const profile = await tx.profile.upsert({
        where: { slug: KONSTANTIN_PROFILE_SEED.slug },
        update: {
          name: KONSTANTIN_PROFILE_SEED.name,
          title: KONSTANTIN_PROFILE_SEED.title,
          description: KONSTANTIN_PROFILE_SEED.description,
          location: KONSTANTIN_PROFILE_SEED.location,
          timezone: KONSTANTIN_PROFILE_SEED.timezone,
          available: KONSTANTIN_PROFILE_SEED.available,
        },
        create: {
          id: KONSTANTIN_PROFILE_SEED.id,
          slug: KONSTANTIN_PROFILE_SEED.slug,
          name: KONSTANTIN_PROFILE_SEED.name,
          title: KONSTANTIN_PROFILE_SEED.title,
          description: KONSTANTIN_PROFILE_SEED.description,
          location: KONSTANTIN_PROFILE_SEED.location,
          timezone: KONSTANTIN_PROFILE_SEED.timezone,
          available: KONSTANTIN_PROFILE_SEED.available,
        },
      });

      await tx.socialLink.deleteMany({ where: { profileId: profile.id } });
      await tx.skill.deleteMany({ where: { profileId: profile.id } });
      await tx.experience.deleteMany({ where: { profileId: profile.id } });
      await tx.project.deleteMany({ where: { profileId: profile.id } });

      await tx.socialLink.createMany({
        data: KONSTANTIN_PROFILE_SEED.links.map((l) => ({
          ...l,
          profileId: profile.id,
        })),
      });

      await tx.skill.createMany({
        data: KONSTANTIN_PROFILE_SEED.skills.map((s) => ({
          ...s,
          profileId: profile.id,
        })),
      });

      await tx.experience.createMany({
        data: KONSTANTIN_PROFILE_SEED.experience.map((e) => ({
          ...e,
          profileId: profile.id,
        })),
      });

      await tx.project.createMany({
        data: KONSTANTIN_PROFILE_SEED.projects.map((p) => ({
          ...p,
          profileId: profile.id,
        })),
      });
    });
  }
}
