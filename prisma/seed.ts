/**
 * Prisma CLI Seed Script (`npx prisma db seed` / `npm run prisma:seed`)
 * Idempotently populates PostgreSQL with Konstantin's developer profile,
 * skills, work experience, and open-source projects inside an ACID transaction.
 */

import { PrismaClient } from "@prisma/client";
import { KONSTANTIN_PROFILE_SEED } from "../src/database/seed-data";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("🌱 [Prisma Seed] Starting idempotent database seed...");

  await prisma.$transaction(async (tx) => {
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

    // Replace child collections cleanly inside the transaction
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

  console.log(
    "✅ [Prisma Seed] Successfully seeded profile, links, skills, experience & projects.",
  );
}

main()
  .catch((err) => {
    console.error("❌ [Prisma Seed] Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
