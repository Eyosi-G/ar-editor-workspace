import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { IUser } from '../../decorators/user.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from 'libs/schemas/project.schema';
import { Model } from 'mongoose';
import { ContentType, UpdateTargetsDto } from './dto/update-target.dto';

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

  async updateTargets(account: IUser, updateTargetDto: UpdateTargetsDto) {
    await this.projectModel.updateOne({
      id: updateTargetDto.projectId,
      account: account.id,
      targets: updateTargetDto.targets.map((target) => {
        return {
          name: target.name,
          img_src: target.imgSrc,
          height: target.height,
          width: target.width,
          contents: target.contents.map((content) => {
            return {
              name: content.name,
              type: content.type,
              position: content.position,
              scale: content.scale,
              rotation: content.rotation,
              text:
                content.type == ContentType.TEXT
                  ? {
                      value: content.text.value,
                      fontSize: content.text.fontSize,
                      fontWeight: content.text.fontWeight,
                    }
                  : undefined,
              image:
                content.type == ContentType.IMAGE
                  ? {
                      value: content.image.value,
                      height: content.image.height,
                      width: content.image.width,
                    }
                  : undefined,
              embeded:
                content.type == ContentType.EMBEDED
                  ? {
                      value: content.embeded.value,
                      service: content.embeded.service,
                      autoplay: content.embeded.autoplay,
                      loop: content.embeded.loop,
                      muted: content.embeded.muted,
                    }
                  : undefined,
            };
          }),
        };
      }),
    });
  }
}
