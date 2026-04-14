import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { IUser } from '../../decorators/user.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from 'libs/schemas/project.schema';
import { Model } from 'mongoose';
import { ContentType, UpdateTargetsDto } from './dto/update-target.dto';
import { UploadService } from '@app/upload';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class ProjectService {
  
  constructor(
    private readonly uploadService: UploadService,
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

  async publishProject(id: string, account: IUser,  file: Express.Multer.File) {
    const extension = path.extname(file.originalname);
    const random = randomUUID();
    const key = `assets/${random}${extension}`;
    await this.uploadService.uploadFile(key, file.buffer, file.mimetype);
    const url = this.uploadService.getUploadURL(key);

    await this.projectModel.findOneAndUpdate(
      { _id: id, account: account.id },
      {
        is_published: true,
        build_url: url,
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
          img_src: target.img_src,
          height: target.height,
          width: target.width,
          contents: target.contents.map((content) => {
            console.log(content.embeded);
            return {
              name: content.name,
              type: content.type,
              position: content.position,
              scale: content.scale,
              rotation: content.rotation,
              text: content.type == ContentType.TEXT ? content.text : undefined,
              image:
                content.type == ContentType.IMAGE ? content.image : undefined,
              embeded:
                content.type == ContentType.EMBEDED
                  ? content.embeded
                  : undefined,
            };
          }),
        };
      }),
    });
  }

  async deleteProjectById(account: IUser, id: string) {
    await this.projectModel.findOneAndDelete({ account: account.id, _id: id });
  }

  getPublishedProjectById(id: string) {
    return this.projectModel.findOne({
      is_published: true,
      _id: id,
    });
  }
}
