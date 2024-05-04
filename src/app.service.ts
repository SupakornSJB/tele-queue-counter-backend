import { Injectable } from '@nestjs/common';
import { ServerService } from './services/server/server.service';
import { TrafficService } from './services/traffic/traffic.service';
import { UserService } from './services/user/user.service';

@Injectable()
export class AppService {
  constructor(
    public userService: UserService,
    public serverService: ServerService,
    public trafficService: TrafficService,
  ) {
    console.log(this.getHello());
    this.createTestData();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async createTestData() {
    const result = this.userService.createUser('0000000000000000', {
      name: 'Test User',
      color: 'FFFFFF',
    });

    console.log('userID: ' + result);

    const serverResult = await this.serverService.createServer({
      name: 'Test Server',
    });

    this.trafficService.createTraffic(result, {
      serverId: serverResult.id,
    });

    console.log('Test Data Created!');
  }
}
