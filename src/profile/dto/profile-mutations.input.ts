import { Field, Float, InputType, Int } from "@nestjs/graphql";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from "class-validator";

@InputType("CreateSkillInput", {
  description:
    "Input payload for adding a new technical skill to the developer profile",
})
export class CreateSkillInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String, { defaultValue: "BACKEND" })
  @IsString()
  category: string;

  @Field(() => Int, { defaultValue: 95 })
  @IsInt()
  @Min(1)
  @Max(100)
  proficiencyPercent: number;

  @Field(() => Float, { defaultValue: 4.0 })
  @IsNumber()
  @Min(0.5)
  yearsOfExperience: number;
}

@InputType("CreateProjectInput", {
  description:
    "Input payload for adding a new portfolio project to the developer profile",
})
export class CreateProjectInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => String)
  @IsUrl()
  url: string;

  @Field(() => String)
  @IsUrl()
  repositoryUrl: string;

  @Field(() => [String], { defaultValue: ["TypeScript", "NestJS", "GraphQL"] })
  @IsString({ each: true })
  techStack: string[];

  @Field(() => [String], { defaultValue: [] })
  @IsOptional()
  @IsString({ each: true })
  highlights: string[];

  @Field(() => Boolean, { defaultValue: true })
  @IsBoolean()
  featured: boolean;
}
