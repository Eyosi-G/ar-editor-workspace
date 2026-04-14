import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from 'libs/schemas/project.schema';
import { AuthGuard } from '../../guards/auth.guard';
import { Account, AccountSchema } from 'libs/schemas/account.schema';
import { UploadModule } from '@app/upload';

@Module({
  imports: [
    UploadModule,
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Account.name, schema: AccountSchema }
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, AuthGuard],
})
export class ProjectModule {}
