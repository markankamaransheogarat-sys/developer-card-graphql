import "reflect-metadata";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { BatchDataLoader } from "../src/common/dataloader/batch-loader";
import { PrismaService } from "../src/database/prisma.service";
import { ProfileRepository } from "../src/profile/repositories/profile.repository";
import { ProfileDataLoaderService } from "../src/profile/services/profile-dataloader.service";
import { ProfileService } from "../src/profile/services/profile.service";
import { ProfileResolver } from "../src/profile/resolvers/profile.resolver";

describe("Developer Digital Business Card — Architecture & GraphQL Suite", () => {
  it("BatchDataLoader coalesces concurrent loads within the same tick into a single batch call (N+1 prevention)", async () => {
    let batchCallCount = 0;
    let receivedKeys: readonly string[] = [];

    const loader = new BatchDataLoader<string, string[]>(async (keys) => {
      batchCallCount += 1;
      receivedKeys = keys;
      return keys.map((k) => [`skill-for-${k}`]);
    });

    const [resA, resB, resA2] = await Promise.all([
      loader.load("profile-1"),
      loader.load("profile-2"),
      loader.load("profile-1"), // duplicate key within same tick should be deduplicated
    ]);

    assert.equal(batchCallCount, 1, "Must execute exactly 1 batch query");
    assert.deepEqual(receivedKeys, ["profile-1", "profile-2"]);
    assert.deepEqual(resA, ["skill-for-profile-1"]);
    assert.deepEqual(resB, ["skill-for-profile-2"]);
    assert.deepEqual(resA2, ["skill-for-profile-1"]);
  });

  it("Resolves complete developer profile, links, skills, experience, and projects via Resolver + DataLoader", async () => {
    const prisma = new PrismaService();
    const repository = new ProfileRepository(prisma);
    const dataLoader = new ProfileDataLoaderService(repository);
    const service = new ProfileService(repository);
    const resolver = new ProfileResolver(service, dataLoader);

    const profile = await resolver.getProfile();
    assert.ok(profile.name.includes("Konstantin"));
    assert.ok(profile.description.length > 30);

    const [links, skills, experience, projects] = await Promise.all([
      resolver.resolveLinks(profile),
      resolver.resolveSkills(profile),
      resolver.resolveExperience(profile),
      resolver.resolveProjects(profile),
    ]);

    assert.ok(links.length >= 2, "Should include GitHub & professional links");
    assert.ok(
      links.some((l) =>
        l.url.includes("github.com/markankamaransheogarat-sys"),
      ),
    );

    assert.ok(skills.length >= 8, "Should include core technical skills");
    assert.ok(skills.some((s) => s.name.includes("TypeScript")));
    assert.ok(skills.some((s) => s.name.includes("NestJS")));
    assert.ok(skills.some((s) => s.name.includes("Prisma")));
    assert.ok(skills.some((s) => s.name.includes("GraphQL")));

    const backendSkills = await resolver.resolveSkills(profile, "BACKEND");
    assert.ok(backendSkills.length > 0);
    assert.ok(backendSkills.every((s) => s.category === "BACKEND"));

    assert.ok(experience.length >= 3, "Should include work experience entries");
    assert.ok(experience[0].company.length > 0);
    assert.ok(experience[0].position.length > 0);
    assert.ok(experience[0].achievements.length > 0);

    assert.ok(projects.length >= 4, "Should include portfolio projects");
    assert.ok(
      projects.every((p) => p.name.length > 0 && p.link.startsWith("http")),
    );

    const featuredProjects = await resolver.resolveProjects(profile, true);
    assert.ok(featuredProjects.length > 0);
    assert.ok(featuredProjects.every((p) => p.featured === true));
  });

  it("Supports mutations (addSkill & addProject) and invalidates request DataLoader cache", async () => {
    const prisma = new PrismaService();
    const repository = new ProfileRepository(prisma);
    const dataLoader = new ProfileDataLoaderService(repository);
    const service = new ProfileService(repository);
    const resolver = new ProfileResolver(service, dataLoader);

    const profile = await resolver.getProfile();
    const initialSkills = await resolver.resolveSkills(profile);

    const addedSkill = await resolver.addSkill({
      name: "Apollo Federation",
      category: "BACKEND",
      proficiencyPercent: 92,
      yearsOfExperience: 3,
    });
    assert.equal(addedSkill.name, "Apollo Federation");

    const updatedSkills = await resolver.resolveSkills(profile);
    assert.equal(updatedSkills.length, initialSkills.length + 1);

    const addedProject = await resolver.addProject({
      name: "Developer Card GraphQL Service",
      description:
        "NestJS + Prisma + GraphQL Digital Business Card with DataLoader",
      url: "https://github.com/markankamaransheogarat-sys/developer-card-graphql",
      repositoryUrl:
        "https://github.com/markankamaransheogarat-sys/developer-card-graphql",
      techStack: ["TypeScript", "NestJS", "Prisma", "GraphQL", "Docker"],
      highlights: ["Zero N+1 queries via Request-Scoped BatchDataLoader"],
      featured: true,
    });
    assert.equal(addedProject.name, "Developer Card GraphQL Service");
  });
});
