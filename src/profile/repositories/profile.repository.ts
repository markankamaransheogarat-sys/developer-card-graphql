import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import {
  KONSTANTIN_PROFILE_SEED,
  SeedProfilePayload,
} from "../../database/seed-data";
import { ProfileModel } from "../models/profile.model";
import { SocialLinkModel } from "../models/social-link.model";
import { SkillModel } from "../models/skill.model";
import { ExperienceModel } from "../models/experience.model";
import { ProjectModel } from "../models/project.model";
import {
  CreateProjectInput,
  CreateSkillInput,
} from "../dto/profile-mutations.input";

/**
 * Data Access Layer (Repository Pattern)
 * Isolates all Prisma ORM queries and provides batch-loading primitives (`WHERE profile_id IN (...)`)
 * for the GraphQL DataLoader layer to guarantee zero N+1 SQL queries.
 */
@Injectable()
export class ProfileRepository {
  // Mutable in-memory fallback store used only if PostgreSQL is not reachable
  private readonly fallbackStore: SeedProfilePayload = structuredClone(
    KONSTANTIN_PROFILE_SEED,
  );

  constructor(private readonly prisma: PrismaService) {}

  public async findPrimaryProfile(): Promise<ProfileModel | null> {
    if (!this.prisma.isDatabaseConnected()) {
      return {
        id: this.fallbackStore.id,
        slug: this.fallbackStore.slug,
        name: this.fallbackStore.name,
        title: this.fallbackStore.title,
        description: this.fallbackStore.description,
        location: this.fallbackStore.location,
        timezone: this.fallbackStore.timezone,
        available: this.fallbackStore.available,
      };
    }

    const row =
      (await this.prisma.profile.findUnique({
        where: { slug: "primary" },
      })) ?? (await this.prisma.profile.findFirst());

    if (!row) return null;
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      title: row.title,
      description: row.description,
      location: row.location,
      timezone: row.timezone,
      available: row.available,
    };
  }

  /**
   * Batch loads SocialLinks for multiple profileIds in a single SQL query (`WHERE profile_id IN (...)`)
   */
  public async findLinksByProfileIds(
    profileIds: readonly string[],
  ): Promise<readonly SocialLinkModel[][]> {
    if (!this.prisma.isDatabaseConnected()) {
      return profileIds.map((id) =>
        id === this.fallbackStore.id ? [...this.fallbackStore.links] : [],
      );
    }

    const rows = await this.prisma.socialLink.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: "asc" },
    });

    const grouped = new Map<string, SocialLinkModel[]>();
    for (const r of rows) {
      const list = grouped.get(r.profileId) ?? [];
      list.push({
        id: r.id,
        platform: r.platform,
        label: r.label,
        url: r.url,
        sortOrder: r.sortOrder,
      });
      grouped.set(r.profileId, list);
    }

    return profileIds.map((id) => grouped.get(id) ?? []);
  }

  /**
   * Batch loads Skills for multiple profileIds in a single SQL query (`WHERE profile_id IN (...)`)
   */
  public async findSkillsByProfileIds(
    profileIds: readonly string[],
  ): Promise<readonly SkillModel[][]> {
    if (!this.prisma.isDatabaseConnected()) {
      return profileIds.map((id) =>
        id === this.fallbackStore.id ? [...this.fallbackStore.skills] : [],
      );
    }

    const rows = await this.prisma.skill.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: "asc" },
    });

    const grouped = new Map<string, SkillModel[]>();
    for (const r of rows) {
      const list = grouped.get(r.profileId) ?? [];
      list.push({
        id: r.id,
        name: r.name,
        category: r.category,
        proficiencyPercent: r.proficiencyPercent,
        yearsOfExperience: r.yearsOfExperience,
        sortOrder: r.sortOrder,
      });
      grouped.set(r.profileId, list);
    }

    return profileIds.map((id) => grouped.get(id) ?? []);
  }

  /**
   * Batch loads Experiences for multiple profileIds in a single SQL query (`WHERE profile_id IN (...)`)
   */
  public async findExperiencesByProfileIds(
    profileIds: readonly string[],
  ): Promise<readonly ExperienceModel[][]> {
    if (!this.prisma.isDatabaseConnected()) {
      return profileIds.map((id) =>
        id === this.fallbackStore.id ? [...this.fallbackStore.experience] : [],
      );
    }

    const rows = await this.prisma.experience.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: "asc" },
    });

    const grouped = new Map<string, ExperienceModel[]>();
    for (const r of rows) {
      const list = grouped.get(r.profileId) ?? [];
      list.push({
        id: r.id,
        company: r.company,
        position: r.position,
        period: r.period,
        startDate: r.startDate,
        endDate: r.endDate,
        isCurrent: r.isCurrent,
        achievements: r.achievements,
        technologies: r.technologies,
        sortOrder: r.sortOrder,
      });
      grouped.set(r.profileId, list);
    }

    return profileIds.map((id) => grouped.get(id) ?? []);
  }

  /**
   * Batch loads Projects for multiple profileIds in a single SQL query (`WHERE profile_id IN (...)`)
   */
  public async findProjectsByProfileIds(
    profileIds: readonly string[],
  ): Promise<readonly ProjectModel[][]> {
    if (!this.prisma.isDatabaseConnected()) {
      return profileIds.map((id) =>
        id === this.fallbackStore.id
          ? this.fallbackStore.projects.map((p) => ({
              ...p,
              link: p.repositoryUrl || p.url,
            }))
          : [],
      );
    }

    const rows = await this.prisma.project.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: "asc" },
    });

    const grouped = new Map<string, ProjectModel[]>();
    for (const r of rows) {
      const list = grouped.get(r.profileId) ?? [];
      list.push({
        id: r.id,
        name: r.name,
        description: r.description,
        url: r.url,
        repositoryUrl: r.repositoryUrl,
        link: r.repositoryUrl || r.url,
        techStack: r.techStack,
        highlights: r.highlights,
        featured: r.featured,
        sortOrder: r.sortOrder,
      });
      grouped.set(r.profileId, list);
    }

    return profileIds.map((id) => grouped.get(id) ?? []);
  }

  public async createSkill(
    profileId: string,
    input: CreateSkillInput,
  ): Promise<SkillModel> {
    if (!this.prisma.isDatabaseConnected()) {
      const created: SkillModel = {
        id: `skill_${Date.now()}`,
        name: input.name,
        category: input.category.toUpperCase(),
        proficiencyPercent: input.proficiencyPercent,
        yearsOfExperience: input.yearsOfExperience,
        sortOrder: this.fallbackStore.skills.length + 1,
      };
      this.fallbackStore.skills.push(created);
      return created;
    }

    const count = await this.prisma.skill.count({ where: { profileId } });
    const row = await this.prisma.skill.create({
      data: {
        profileId,
        name: input.name,
        category: input.category.toUpperCase(),
        proficiencyPercent: input.proficiencyPercent,
        yearsOfExperience: input.yearsOfExperience,
        sortOrder: count + 1,
      },
    });

    return {
      id: row.id,
      name: row.name,
      category: row.category,
      proficiencyPercent: row.proficiencyPercent,
      yearsOfExperience: row.yearsOfExperience,
      sortOrder: row.sortOrder,
    };
  }

  public async createProject(
    profileId: string,
    input: CreateProjectInput,
  ): Promise<ProjectModel> {
    if (!this.prisma.isDatabaseConnected()) {
      const created = {
        id: `proj_${Date.now()}`,
        name: input.name,
        description: input.description,
        url: input.url,
        repositoryUrl: input.repositoryUrl,
        techStack: input.techStack,
        highlights: input.highlights ?? [],
        featured: input.featured,
        sortOrder: this.fallbackStore.projects.length + 1,
      };
      this.fallbackStore.projects.push(created);
      return {
        ...created,
        link: created.repositoryUrl || created.url,
      };
    }

    const count = await this.prisma.project.count({ where: { profileId } });
    const row = await this.prisma.project.create({
      data: {
        profileId,
        name: input.name,
        description: input.description,
        url: input.url,
        repositoryUrl: input.repositoryUrl,
        techStack: input.techStack,
        highlights: input.highlights ?? [],
        featured: input.featured,
        sortOrder: count + 1,
      },
    });

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      url: row.url,
      repositoryUrl: row.repositoryUrl,
      link: row.repositoryUrl || row.url,
      techStack: row.techStack,
      highlights: row.highlights,
      featured: row.featured,
      sortOrder: row.sortOrder,
    };
  }
}
