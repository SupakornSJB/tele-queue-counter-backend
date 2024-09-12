import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MainGateway } from './gateways/main/main.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { TrafficModule } from './modules/traffic/traffic.module';
import { ServerModule } from './modules/server/server.module';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

// `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@{HOSTNAME}:27017`,
// HOSTNAME is hostname of the docker container, which is mongo in this case

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.getOrThrow("REDIS_HOST"),
        port: configService.getOrThrow("REDIS_PORT")
      })
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://
          ${configService.getOrThrow("MONGO_USER")}:
          ${configService.getOrThrow("MONGO_PASSWORD")}@
          ${configService.getOrThrow("MONGO_HOSTNAME")}:
          ${configService.getOrThrow("MONGO_PORT")}`
      })
      // "mongodb://localhost:27017",
      // {
      //   dbName: process.env.MONGO_DBNAME,
      // }
    }),
    UserModule,
    TrafficModule,
    ServerModule,
  ],
  controllers: [AppController],
  providers: [AppService, MainGateway],
})
export class AppModule { }
