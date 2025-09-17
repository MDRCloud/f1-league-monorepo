import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwt: JwtService, private roles: string[]) {}
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers["authorization"];
    if (!auth) throw new UnauthorizedException("Missing token");
    const token = auth.replace("Bearer ", "");
    const payload: any = this.jwt.verify(token, { secret: process.env.JWT_SECRET || "dev-secret" });
    const userRoles: string[] = payload.roles || [];
    const ok = this.roles.some(r => userRoles.includes(r));
    if (!ok) throw new UnauthorizedException("Insufficient role");
    (req as any).user = payload;
    return true;
  }
}
