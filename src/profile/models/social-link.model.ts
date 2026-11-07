import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("SocialLink", {
  description:
    "Professional social or portfolio link (GitHub, LinkedIn, Email, Live Demo)",
})
export class SocialLinkModel {
  @Field(() => ID)
  id: string;

  @Field(() => String, {
    description: "Platform name (e.g. GitHub, LinkedIn, Portfolio)",
  })
  platform: string;

  @Field(() => String, { description: "Display label for the link" })
  label: string;

  @Field(() => String, { description: "Full URL to the resource" })
  url: string;

  @Field(() => Int)
  sortOrder: number;
}
