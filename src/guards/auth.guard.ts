import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { UserService } from "src/services/user/user.service";

export const IS_PUBLIC_KEY = "is_public_key";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
    private userService: UserService
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) return true;

    const bearerToken: string = context.getArgs()[0].handshake.headers.authorization.split(" ")[1];
    if (!bearerToken) return false;

    return this.jwtService.verifyAsync(bearerToken, { secret: this.configService.get("JWT_SECRET") })
      .then(async (decoded) => {
        const user = await this.userService.findUserByName(decoded.username)
        if (user) {
          const data = context.switchToWs().getData()
          data['userId'] = user.id
        }
        return !!user
      })
  }
}
