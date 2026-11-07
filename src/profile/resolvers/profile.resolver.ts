import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { ProfileModel } from "../models/profile.model";
import { SocialLinkModel } from "../models/social-link.model";
import { SkillModel } from "../models/skill.model";
import { ExperienceModel } from "../models/experience.model";
import { ProjectModel } from "../models/project.model";
import { ProfileService } from "../services/profile.service";
import { ProfileDataLoaderService } from "../services/profile-dataloader.service";
import {
  CreateProjectInput,
  CreateSkillInput,
} from "../dto/profile-mutations.input";

/**
 * GraphQL Presentation Layer (`ProfileResolver`)
 *
 * Exposes the developer Digital Business Card via GraphQL queries & mutations.
 * Nested relations (`links`, `skills`, `experience`, `projects`) are resolved
 * lazily on demand via `ProfileDataLoaderService`, ensuring:
 * 1. If a client does not request a nested relation, zero database queries are executed for it.
 * 2. When nested relations ARE requested, calls are batched into O(1) SQL queries via `BatchDataLoader`.
 */
@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly dataLoader: ProfileDataLoaderService,
  ) {}

  @Query(() => ProfileModel, {
    name: "profile",
    description:
      "Fetches Konstantin's Developer Digital Business Card (bio, links, skills, experience, and projects)",
  })
  public async getProfile(): Promise<ProfileModel> {
    return this.profileService.getPrimaryProfile();
  }

  @ResolveField(() => [SocialLinkModel], {
    name: "links",
    description: "Professional links (GitHub, Live Portfolio, Email)",
  })
  public async resolveLinks(
    @Parent() profile: ProfileModel,
  ): Promise<SocialLinkModel[]> {
    return this.dataLoader.linksByProfileLoader.load(profile.id);
  }

  @ResolveField(() => [SkillModel], {
    name: "skills",
    description:
      "Technical skills list with optional category filter (BACKEND, DATABASE, DEVOPS_CLOUD, AI_ENGINEERING)",
  })
  public async resolveSkills(
    @Parent() profile: ProfileModel,
    @Args("category", { type: () => String, nullable: true })
    category?: string,
  ): Promise<SkillModel[]> {
    const skills = await this.dataLoader.skillsByProfileLoader.load(profile.id);
    return this.profileService.getFilteredSkills(profile.id, skills, category);
  }

  @ResolveField(() => [ExperienceModel], {
    name: "experience",
    description: "Commercial work experience and engineering achievements",
  })
  public async resolveExperience(
    @Parent() profile: ProfileModel,
  ): Promise<ExperienceModel[]> {
    return this.dataLoader.experienceByProfileLoader.load(profile.id);
  }

  @ResolveField(() => [ProjectModel], {
    name: "projects",
    description:
      "Portfolio of open-source & production projects with optional featured filter",
  })
  public async resolveProjects(
    @Parent() profile: ProfileModel,
    @Args("featuredOnly", { type: () => Boolean, nullable: true })
    featuredOnly?: boolean,
  ): Promise<ProjectModel[]> {
    const projects = await this.dataLoader.projectsByProfileLoader.load(
      profile.id,
    );
    return this.profileService.getFilteredProjects(projects, featuredOnly);
  }

  @Mutation(() => SkillModel, {
    name: "addSkill",
    description: "Adds a new technical skill to the primary developer profile",
  })
  public async addSkill(
    @Args("input") input: CreateSkillInput,
  ): Promise<SkillModel> {
    const created = await this.profileService.addSkillToPrimaryProfile(input);
    this.dataLoader.clearAllCaches();
    return created;
  }

  @Mutation(() => ProjectModel, {
    name: "addProject",
    description:
      "Adds a new portfolio project to the primary developer profile",
  })
  public async addProject(
    @Args("input") input: CreateProjectInput,
  ): Promise<ProjectModel> {
    const created = await this.profileService.addProjectToPrimaryProfile(input);
    this.dataLoader.clearAllCaches();
    return created;
  }
}
