import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { PrismaModule } from "./database/prisma.module";
import { ProfileModule } from "./profile/profile.module";

const DEFAULT_EXAMPLE_QUERY = `# Welcome to Konstantin's Developer Digital Business Card (GraphQL API)
# Click the "Run" button above to execute the query against PostgreSQL + DataLoader:

query GetDeveloperCard {
  profile {
    name
    title
    description
    location
    timezone
    available
    links {
      platform
      label
      url
    }
    skills {
      name
      category
      proficiencyPercent
      yearsOfExperience
    }
    experience {
      company
      position
      period
      isCurrent
      achievements
      technologies
    }
    projects {
      name
      description
      url
      repositoryUrl
      link
      featured
      techStack
      highlights
    }
  }
}
`;

@Module({
  imports: [
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      introspection: true,
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({
          embed: true,
          includeCookies: false,
          document: DEFAULT_EXAMPLE_QUERY,
        }),
      ],
    }),
    ProfileModule,
  ],
})
export class AppModule {}
