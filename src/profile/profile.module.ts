import { Module } from "@nestjs/common";
import { ProfileRepository } from "./repositories/profile.repository";
import { ProfileDataLoaderService } from "./services/profile-dataloader.service";
import { ProfileService } from "./services/profile.service";
import { ProfileResolver } from "./resolvers/profile.resolver";

@Module({
  providers: [
    ProfileRepository,
    ProfileDataLoaderService,
    ProfileService,
    ProfileResolver,
  ],
  exports: [ProfileService, ProfileRepository],
})
export class ProfileModule {}
