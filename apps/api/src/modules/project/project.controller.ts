import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { IUser, User } from '../../decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateTargetsDto } from './dto/update-target.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import * as path from 'path';
import { Express } from 'express';

@ApiBearerAuth()
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'pattern', maxCount: 1 },
        { name: 'marker', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        fileFilter(req, file, callback) {
          const maxSize = 1024 * 1024 * 1;
          if (file.size > maxSize) {
            return callback(
              new BadRequestException('file must be less than 1mb'),
              false,
            );
          }
          const extensions = ['.png', '.patt'];
          if (!extensions.includes(path.extname(file.originalname))) {
            return callback(
              new BadRequestException('file format not allowed'),
              false,
            );
          }
          callback(null, true);
        },
      },
    ),
  )
  @UseGuards(AuthGuard)
  @Post()
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles()
    files: { pattern?: Express.Multer.File[]; marker?: Express.Multer.File[] },
    @User() account: IUser,
  ) {
    return await this.projectService.createProject(account, files, createProjectDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  getProjects(@User() account: IUser) {
    return this.projectService.getProjects(account);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getProjectById(@User() account: IUser, @Param('id') id: string) {
    return this.projectService.getProjectById(account, id);
  }

  @Get(':id/published')
  getPublishedProjectById(@Param('id') id: string) {
    return this.projectService.getPublishedProjectById(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteProjectById(@User() account: IUser, @Param('id') id: string) {
    return this.projectService.deleteProjectById(account, id);
  }

  @UseGuards(AuthGuard)
  @Put('update-targets')
  updateTargets(
    @User() account: IUser,
    @Body() updateTargetDto: UpdateTargetsDto,
  ) {
    return this.projectService.updateTargets(account, updateTargetDto);
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter(req, file, callback) {
        const maxSize = 1024 * 1024 * 1;
        if (file.size > maxSize) {
          return callback(
            new BadRequestException('file must be less than 1mb'),
            false,
          );
        }
        console.log(file);
        const ext = path.extname(file.originalname);
        if (ext != '.mind') {
          return callback(
            new BadRequestException('file format not allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @UseGuards(AuthGuard)
  @Post(':id/publish')
  async publishProject(
    @User() account: IUser,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.projectService.publishProject(id, account, file);
  }
}
