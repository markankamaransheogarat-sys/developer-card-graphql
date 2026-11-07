import { Field, ID, ObjectType } from "@nestjs/graphql";
import { SocialLinkModel } from "./social-link.model";
import { SkillModel } from "./skill.model";
import { ExperienceModel } from "./experience.model";
import { ProjectModel } from "./project.model";

@ObjectType("Profile", {
  description:
    "Developer Digital Business Card root entity containing bio, links, skills, experience, and projects",
})
export class ProfileModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  slug: string;

  @Field(() => String, { description: "Developer full name" })
  name: string;

  @Field(() => String, {
    description: "Professional headline / specialization",
  })
  title: string;

  @Field(() => String, { description: "Executive summary & engineering bio" })
  description: string;

  @Field(() => String, { description: "Location / remote work status" })
  location: string;

  @Field(() => String, {
    description: "Working timezone and mandatory online window",
  })
  timezone: string;

  @Field(() => Boolean, {
    description: "Current availability for full-time engagement",
  })
  available: boolean;

  @Field(() => [SocialLinkModel], {
    description: "Links to GitHub, LinkedIn, Portfolio, and contact channels",
  })
  links?: SocialLinkModel[];

  @Field(() => [SkillModel], {
    description:
      "List of technical skills resolved via request-scoped DataLoader",
  })
  skills?: SkillModel[];

  @Field(() => [ExperienceModel], {
    description:
      "Chronological commercial work experience resolved via request-scoped DataLoader",
  })
  experience?: ExperienceModel[];

  @Field(() => [ProjectModel], {
    description:
      "Portfolio of featured open-source & production projects resolved via request-scoped DataLoader",
  })
  projects?: ProjectModel[];
}
