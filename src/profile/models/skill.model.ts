import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("Skill", {
  description:
    "Technical skill with category, proficiency percentage, and years of production experience",
})
export class SkillModel {
  @Field(() => ID)
  id: string;

  @Field(() => String, {
    description: "Skill or technology name (e.g. TypeScript, NestJS, Prisma)",
  })
  name: string;

  @Field(() => String, {
    description:
      "Domain category (BACKEND, DATABASE, DEVOPS_CLOUD, AI_ENGINEERING)",
  })
  category: string;

  @Field(() => Int, { description: "Self-assessed proficiency score (0-100)" })
  proficiencyPercent: number;

  @Field(() => Float, {
    description: "Years of hands-on commercial experience",
  })
  yearsOfExperience: number;

  @Field(() => Int)
  sortOrder: number;
}
