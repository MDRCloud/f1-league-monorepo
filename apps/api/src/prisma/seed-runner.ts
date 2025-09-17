import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function pointsConfig() {
  return {
    race: [25,18,15,12,10,8,6,4,2,1],
    sprint: [8,7,6,5,4,3,2,1],
    fastestLap: { enabled: true, topN: 10, points: 1 },
    dnfPolicy: "no_points",
    dnsPolicy: "no_points",
    dsqPolicy: "zero_points"
  };
}

async function main() {
  // Roles
  const roles = ["ADMIN", "STEWARD", "DRIVER", "VIEWER"];
  for (const r of roles) {
    await prisma.role.upsert({ where: { name: r }, update: {}, create: { name: r } });
  }

  // Users
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@league.local";
  const adminPw = process.env.SEED_ADMIN_PASSWORD || "admin123";
  const viewerEmail = process.env.SEED_VIEWER_EMAIL || "viewer@league.local";
  const viewerPw = process.env.SEED_VIEWER_PASSWORD || "viewer123";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: bcrypt.hashSync(adminPw, 10),
      roles: {
        create: [
          { role: { connect: { name: "ADMIN" } } },
          { role: { connect: { name: "STEWARD" } } }
        ]
      }
    }
  });

  await prisma.user.upsert({
    where: { email: viewerEmail },
    update: {},
    create: {
      email: viewerEmail,
      password: bcrypt.hashSync(viewerPw, 10),
      roles: { create: [{ role: { connect: { name: "VIEWER" } } }] }
    }
  });

  // Season 2025 sample
  const season = await prisma.season.upsert({
    where: { id: "seed-season-2025" },
    update: {},
    create: {
      id: "seed-season-2025",
      name: "Chaos Cup 2025",
      year: 2025,
      defaultTZ: "Europe/London",
      pointsConfig: pointsConfig()
    }
  });

  // Teams
  const teams = await prisma.$transaction([
    prisma.team.create({ data: { name: "Red Comet Racing", code: "RCR", primary: "#ff1801", secondary: "#1a1a1a" } }),
    prisma.team.create({ data: { name: "Azure Apex", code: "AZX", primary: "#2563eb", secondary: "#0f172a" } }),
    prisma.team.create({ data: { name: "Emerald Velocity", code: "EMV", primary: "#10b981", secondary: "#064e3b" } }),
    prisma.team.create({ data: { name: "Golden Hornet", code: "GHN", primary: "#f59e0b", secondary: "#111827" } })
  ]);

  // Drivers
  const drivers = await prisma.$transaction([
    prisma.driver.create({ data: { name: "Alex Vega", code: "VEG", number: 11, nationality: "GBR" } }),
    prisma.driver.create({ data: { name: "Ben Ito", code: "ITO", number: 22, nationality: "JPN" } }),
    prisma.driver.create({ data: { name: "Cara Novak", code: "NOV", number: 33, nationality: "CZE" } }),
    prisma.driver.create({ data: { name: "Dane Silva", code: "SIL", number: 44, nationality: "BRA" } }),
    prisma.driver.create({ data: { name: "Eli Park", code: "PRK", number: 55, nationality: "KOR" } }),
    prisma.driver.create({ data: { name: "Faye Rossi", code: "ROS", number: 66, nationality: "ITA" } }),
    prisma.driver.create({ data: { name: "Gus Meyer", code: "MYR", number: 77, nationality: "GER" } }),
    prisma.driver.create({ data: { name: "Hana Ortiz", code: "ORT", number: 88, nationality: "ESP" } })
  ]);

  // Contracts (first 2 drivers per team)
  const start = new Date(Date.UTC(2025, 0, 1));
  const contracts = [];
  for (let i = 0; i < 4; i++) {
    contracts.push(await prisma.contract.create({ data: { seasonId: season.id, teamId: teams[i].id, driverId: drivers[i*2+0].id, startDate: start } }));
    contracts.push(await prisma.contract.create({ data: { seasonId: season.id, teamId: teams[i].id, driverId: drivers[i*2+1].id, startDate: start } }));
  }

  // Events + sessions
  const eventsData = [
    { round: 1, name: "Australian Grand Prix", track: "Albert Park", date: new Date(Date.UTC(2025, 2, 14, 4)) },
    { round: 2, name: "Bahrain Grand Prix", track: "Sakhir", date: new Date(Date.UTC(2025, 2, 28, 15)) },
    { round: 3, name: "British Grand Prix", track: "Silverstone", date: new Date(Date.UTC(2025, 6, 10, 14)) },
  ];

  for (const ev of eventsData) {
    const event = await prisma.event.create({
      data: { seasonId: season.id, round: ev.round, name: ev.name, track: ev.track, startDate: ev.date }
    });

    // Sessions: P, Q, (Sprint weekend for round 2), R
    const sessP = await prisma.session.create({ data: { eventId: event.id, type: "PRACTICE", plannedAt: new Date(ev.date.getTime() - 2*24*3600*1000) } });
    const sessQ = await prisma.session.create({ data: { eventId: event.id, type: "QUALIFYING", plannedAt: new Date(ev.date.getTime() - 1*24*3600*1000) } });

    let sessSQ = null; let sessS = null;
    if (ev.round === 2) {
      sessSQ = await prisma.session.create({ data: { eventId: event.id, type: "SPRINT_QUALIFYING", plannedAt: new Date(ev.date.getTime() - 1*24*3600*1000 + 6*3600*1000) } });
      sessS = await prisma.session.create({ data: { eventId: event.id, type: "SPRINT", plannedAt: new Date(ev.date.getTime() - 1*24*3600*1000 + 12*3600*1000) } });
    }
    const sessR = await prisma.session.create({ data: { eventId: event.id, type: "RACE", plannedAt: ev.date } });

    // Minimal sample race results (top 10 scoring)
    const order = [0,1,2,3,4,5,6,7,8,9];
    for (let pos = 0; pos < order.length; pos++) {
      const drv = drivers[order[pos]];
      const team = (await prisma.contract.findFirst({ where: { driverId: drv.id, seasonId: season.id } }))!;
      const points = [25,18,15,12,10,8,6,4,2,1][pos];
      await prisma.result.create({
        data: {
          sessionId: sessR.id,
          driverId: drv.id,
          teamId: team.teamId,
          position: pos+1,
          grid: pos+1,
          status: "FINISHED",
          laps: 58-pos,
          totalTime: 6000000 + pos*10000,
          gapMs: pos*1000,
          bestLapMs: 90000 - pos*50,
          points
        }
      });
    }

    // Make race final
    await prisma.session.update({ where: { id: sessR.id }, data: { isFinal: true } });
  }

  console.log("Seed complete. Admin:", admin.email);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
