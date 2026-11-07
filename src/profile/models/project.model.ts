import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("Project", {
  description:
    "Featured engineering project with live URL, source repository link, and architecture highlights",
})
export class ProjectModel {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: "Project title" })
  name: string;

  @Field(() => String, {
    description: "Detailed project overview and architectural summary",
  })
  description: string;

  @Field(() => String, {
    description: "Live deployment URL or primary project link",
  })
  url: string;

  @Field(() => String, { description: "Git repository URL (GitHub)" })
  repositoryUrl: string;

  @Field(() => String, {
    description: "Convenient alias for repositoryUrl / project link",
  })
  link: string;

  @Field(() => [String], { description: "Technologies used in the project" })
  techStack: string[];

  @Field(() => [String], {
    description: "Key engineering highlights & metrics",
  })
  highlights: string[];

  @Field(() => Boolean)
  featured: boolean;

  @Field(() => Int)
  sortOrder: number;
}
