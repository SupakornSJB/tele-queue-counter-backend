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
  ) { }
}
