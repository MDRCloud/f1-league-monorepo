import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "../services/prisma.service.js";
import { AuthModule } from "./auth/auth.module.js";
import { PublicModule } from "./public/public.module.js";
import { AdminModule } from "./admin/admin.module.js";
import { HealthController } from "./health.controller.js";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, PublicModule, AdminModule],
  controllers: [HealthController],
  providers: [PrismaService]
})
export class AppModule {}
