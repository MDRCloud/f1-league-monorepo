import { Module } from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service.js";
import { PublicController } from "./public.controller.js";
import { StandingsService } from "./standings.service.js";

@Module({
  controllers: [PublicController],
  providers: [PrismaService, StandingsService]
})
export class PublicModule {}
