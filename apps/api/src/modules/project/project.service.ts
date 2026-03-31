import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { IUser } from '../../decorators/user.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from 'libs/schemas/project.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async createProject(account: IUser, createProjectDto: CreateProjectDto) {
    const count = await this.projectModel.countDocuments({
      account: account.id,
    });
    if (count >= account.maxProject) {
      throw new BadRequestException(
        'maximum number of project has reached, contact adminstrator',
      );
    }
    await this.projectModel.create({
      name: createProjectDto.name,
      account: account.id,
    });
  }

  getProjects(account: IUser) {
    return this.projectModel.find({
      account: account.id,
    });
  }

  getProjectById(account: IUser, id: string) {
    return this.projectModel.findOne({
      account: account.id,
      _id: id,
    });
  }

  async publishProject(account: IUser, id: string) {
    await this.projectModel.findOneAndUpdate(
      { _id: id, account: account.id },
      {
        is_published: true,
      },
    );
  }
}
