import { Module } from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service.js";
import { AdminController } from "./admin.controller.js";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [JwtModule.register({})],
  controllers: [AdminController],
  providers: [PrismaService]
})
export class AdminModule {}
