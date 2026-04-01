import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from 'libs/config/app.config';
import { JwtModule } from '@nestjs/jwt';
import { ProjectModule } from './modules/project/project.module';
import { AssetModule } from './modules/asset/asset.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_CONNECTION_URL") ?? "mongodb://localhost/ar-editor",
      }),
    }),
    AuthModule,
    ProjectModule,
    AssetModule
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
