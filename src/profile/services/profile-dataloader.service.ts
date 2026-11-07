import { Injectable, Scope } from "@nestjs/common";
import { BatchDataLoader } from "../../common/dataloader/batch-loader";
import { ProfileRepository } from "../repositories/profile.repository";
import { SocialLinkModel } from "../models/social-link.model";
import { SkillModel } from "../models/skill.model";
import { ExperienceModel } from "../models/experience.model";
import { ProjectModel } from "../models/project.model";

/**
 * Request-Scoped GraphQL DataLoader Service
 *
 * Ensures that within any incoming GraphQL query, nested relations (`links`, `skills`,
 * `experience`, `projects`) are batched into a single `WHERE profile_id IN (...)` query
 * per table, completely eliminating the GraphQL N+1 query problem.
 */
@Injectable({ scope: Scope.REQUEST })
export class ProfileDataLoaderService {
  public readonly linksByProfileLoader: BatchDataLoader<
    string,
    SocialLinkModel[]
  >;
  public readonly skillsByProfileLoader: BatchDataLoader<string, SkillModel[]>;
  public readonly experienceByProfileLoader: BatchDataLoader<
    string,
    ExperienceModel[]
  >;
  public readonly projectsByProfileLoader: BatchDataLoader<
    string,
    ProjectModel[]
  >;

  constructor(private readonly repository: ProfileRepository) {
    this.linksByProfileLoader = new BatchDataLoader<string, SocialLinkModel[]>(
      (profileIds) => this.repository.findLinksByProfileIds(profileIds),
    );

    this.skillsByProfileLoader = new BatchDataLoader<string, SkillModel[]>(
      (profileIds) => this.repository.findSkillsByProfileIds(profileIds),
    );

    this.experienceByProfileLoader = new BatchDataLoader<
      string,
      ExperienceModel[]
    >((profileIds) => this.repository.findExperiencesByProfileIds(profileIds));

    this.projectsByProfileLoader = new BatchDataLoader<string, ProjectModel[]>(
      (profileIds) => this.repository.findProjectsByProfileIds(profileIds),
    );
  }

  public clearAllCaches(): void {
    this.linksByProfileLoader.clearAll();
    this.skillsByProfileLoader.clearAll();
    this.experienceByProfileLoader.clearAll();
    this.projectsByProfileLoader.clearAll();
  }
}
