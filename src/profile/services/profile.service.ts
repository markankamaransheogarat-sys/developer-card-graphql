import { Injectable, NotFoundException } from "@nestjs/common";
import { ProfileRepository } from "../repositories/profile.repository";
import { ProfileModel } from "../models/profile.model";
import { SkillModel } from "../models/skill.model";
import { ProjectModel } from "../models/project.model";
import {
  CreateProjectInput,
  CreateSkillInput,
} from "../dto/profile-mutations.input";

/**
 * Application / Domain Business Logic Layer
 * Coordinates domain rules, filtering, and persistence orchestration without
 * coupling to GraphQL transport details or raw Prisma SQL queries.
 */
@Injectable()
export class ProfileService {
  constructor(private readonly repository: ProfileRepository) {}

  public async getPrimaryProfile(): Promise<ProfileModel> {
    const profile = await this.repository.findPrimaryProfile();
    if (!profile) {
      throw new NotFoundException("Primary developer profile not found");
    }
    return profile;
  }

  public async getFilteredSkills(
    profileId: string,
    allSkills: SkillModel[],
    category?: string,
  ): Promise<SkillModel[]> {
    if (!category || category.trim() === "") {
      return allSkills;
    }
    const normalized = category.trim().toUpperCase();
    return allSkills.filter((s) => s.category.toUpperCase() === normalized);
  }

  public async getFilteredProjects(
    allProjects: ProjectModel[],
    featuredOnly?: boolean,
  ): Promise<ProjectModel[]> {
    if (featuredOnly === undefined || featuredOnly === null) {
      return allProjects;
    }
    return allProjects.filter((p) => p.featured === featuredOnly);
  }

  public async addSkillToPrimaryProfile(
    input: CreateSkillInput,
  ): Promise<SkillModel> {
    const profile = await this.getPrimaryProfile();
    return this.repository.createSkill(profile.id, input);
  }

  public async addProjectToPrimaryProfile(
    input: CreateProjectInput,
  ): Promise<ProjectModel> {
    const profile = await this.getPrimaryProfile();
    return this.repository.createProject(profile.id, input);
  }
}
