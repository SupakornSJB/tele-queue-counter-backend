import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MainGateway } from './gateways/main/main.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { TrafficModule } from './modules/traffic/traffic.module';
import { ServerModule } from './modules/server/server.module';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      // `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.5sklj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
      'mongodb://localhost:27017',
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
