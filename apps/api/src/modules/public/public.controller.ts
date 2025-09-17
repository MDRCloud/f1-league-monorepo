import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../../services/prisma.service.js";
import { StandingsService } from "./standings.service.js";

@ApiTags("public")
@Controller("/api/v1")
export class PublicController {
  constructor(private prisma: PrismaService, private standings: StandingsService) {}

  @Get("seasons")
  listSeasons() { return this.prisma.season.findMany({ orderBy: { year: "desc" } }); }

  @Get("seasons/:id")
  getSeason(@Param("id") id: string) {
    return this.prisma.season.findUnique({ where: { id }, include: { events: { orderBy: { round: "asc" } } } });
  }

  @Get("events/:id")
  getEvent(@Param("id") id: string) {
    return this.prisma.event.findUnique({ where: { id }, include: { sessions: { include: { results: { include: { driver: true, team: true } } } } } });
  }

  @Get("standings/drivers")
  driverStandings(@Query("seasonId") seasonId: string) { return this.standings.driverStandings(seasonId); }

  @Get("standings/constructors")
  constructorStandings(@Query("seasonId") seasonId: string) { return this.standings.constructorStandings(seasonId); }

  @Get("teams")
  teams() { return this.prisma.team.findMany(); }

  @Get("drivers")
  drivers() { return this.prisma.driver.findMany(); }

  @Get("lineups/:seasonId")
  lineups(@Param("seasonId") seasonId: string) {
    return this.prisma.contract.findMany({ where: { seasonId }, include: { driver: true, team: true } });
  }
}
