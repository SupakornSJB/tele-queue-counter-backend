import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MainGateway } from './gateways/main/main.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { TrafficModule } from './modules/traffic/traffic.module';
import { ServerModule } from './modules/server/server.module';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

// `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@{HOSTNAME}:27017`,
// HOSTNAME is hostname of the docker container, which is mongo in this case

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mongo:27017`,
      // "mongodb://localhost:27017",
      {
        dbName: process.env.MONGO_DBNAME,
      }
    ),
    UserModule,
    TrafficModule,
    ServerModule,
  ],
  controllers: [AppController],
  providers: [AppService, MainGateway],
})
export class AppModule { }
