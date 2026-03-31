import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { IUser, User } from '../../decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(AuthGuard)
  @Post()
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @User() account: IUser,
  ) {
    this.projectService.createProject(account, createProjectDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  getProjects(@User() account: IUser) {
    return this.projectService.getProjects(account);
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  getProjectById(@User() account: IUser, @Param("id") id: string) {
    return this.projectService.getProjectById(account, id);
  }

  @UseGuards(AuthGuard)
  @Patch(":id/publish")
  publishProject(@User() account: IUser, @Param("id") id: string) {
    return this.projectService.publishProject(account, id);
  }
}
