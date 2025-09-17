import { Body, Controller, Post, Put, Param, UseGuards } from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service.js";
import { RolesGuard } from "./roles.guard.js";
import { JwtService } from "@nestjs/jwt";

const guard = new RolesGuard(new JwtService(), ["ADMIN", "STEWARD"]);

@Controller("/api/v1/admin")
@UseGuards(guard)
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Post("seasons")
  createSeason(@Body() body: any) { return this.prisma.season.create({ data: body }); }

  @Post("teams")
  createTeam(@Body() body: any) { return this.prisma.team.create({ data: body }); }

  @Post("drivers")
  createDriver(@Body() body: any) { return this.prisma.driver.create({ data: body }); }

  @Post("events")
  createEvent(@Body() body: any) { return this.prisma.event.create({ data: body }); }

  @Post("sessions")
  createSession(@Body() body: any) { return this.prisma.session.create({ data: body }); }

  // Results override with audit log
  @Put("results/:id/override")
  async overrideResult(@Param("id") id: string, @Body() body: { diff: any; reason: string }, req?: any) {
    const updated = await this.prisma.result.update({ where: { id }, data: body.diff });
    await this.prisma.auditLog.create({
      data: {
        actorId: req?.user?.sub || (await this.prisma.user.findFirst({ where: { email: "admin@league.local" } }))!.id,
        action: "RESULT_OVERRIDE",
        entity: `Result:${id}`,
        reason: body.reason,
        diff: body.diff as any
      }
    });
    return updated;
  }
}
