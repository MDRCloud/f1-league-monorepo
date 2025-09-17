import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service.js";

class LoginDto { email!: string; password!: string; }

@ApiTags("auth")
@Controller("/api/v1/auth")
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post("login")
  async login(@Body() body: LoginDto) {
    return this.auth.validate(body.email, body.password);
  }
}
