import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("Experience", {
  description:
    "Commercial work experience record including company, role, period, and key engineering achievements",
})
export class ExperienceModel {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: "Company or organization name" })
  company: string;

  @Field(() => String, { description: "Job title / engineering role" })
  position: string;

  @Field(() => String, {
    description: "Human-readable employment period (e.g. '2023 — Present')",
  })
  period: string;

  @Field(() => String, { description: "ISO year-month start date (YYYY-MM)" })
  startDate: string;

  @Field(() => String, {
    nullable: true,
    description: "ISO year-month end date or null if current",
  })
  endDate?: string | null;

  @Field(() => Boolean, {
    description: "Whether this is the current active role",
  })
  isCurrent: boolean;

  @Field(() => [String], {
    description: "Key measurable engineering achievements",
  })
  achievements: string[];

  @Field(() => [String], { description: "Core technologies used in this role" })
  technologies: string[];

  @Field(() => Int)
  sortOrder: number;
}
