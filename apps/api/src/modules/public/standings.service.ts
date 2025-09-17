import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service.js";

@Injectable()
export class StandingsService {
  constructor(private prisma: PrismaService) {}

  async driverStandings(seasonId: string) {
    const results = await this.prisma.result.findMany({
      where: { session: { event: { seasonId }, type: "RACE", isFinal: true } },
      include: { driver: true, team: true, session: { include: { event: true } } }
    });
    const map = new Map<string, { driverId: string; name: string; code: string; points: number; wins: number; p2: number; p3: number }>();
    for (const r of results) {
      const key = r.driverId;
      if (!map.has(key)) map.set(key, { driverId: r.driverId, name: r.driver.name, code: r.driver.code, points: 0, wins: 0, p2: 0, p3: 0 });
      const d = map.get(key)!;
      d.points += r.points;
      if (r.position === 1) d.wins++;
      if (r.position === 2) d.p2++;
      if (r.position === 3) d.p3++;
    }
    return Array.from(map.values()).sort((a,b) =>
      b.points - a.points ||
      b.wins - a.wins ||
      b.p2 - a.p2 ||
      b.p3 - a.p3
    ).map((d, idx) => ({ position: idx+1, ...d }));
  }

  async constructorStandings(seasonId: string) {
    const results = await this.prisma.result.findMany({
      where: { session: { event: { seasonId }, type: "RACE", isFinal: true } },
      include: { team: true }
    });
    const map = new Map<string, { teamId: string; name: string; code: string; points: number }>();
    for (const r of results) {
      const key = r.teamId;
      if (!map.has(key)) map.set(key, { teamId: r.teamId, name: r.team.name, code: r.team.code, points: 0 });
      const t = map.get(key)!;
      t.points += r.points;
    }
    return Array.from(map.values()).sort((a,b) => b.points - a.points).map((t, idx) => ({ position: idx+1, ...t }));
  }
}
