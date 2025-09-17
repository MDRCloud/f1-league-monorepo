.PHONY: dev prod logs down seed

dev:
	docker compose -f deploy/docker-compose.dev.yml up -d --build

prod:
	docker compose -f deploy/docker-compose.prod.yml up -d --build

logs:
	docker compose -f deploy/docker-compose.dev.yml logs -f

down:
	docker compose -f deploy/docker-compose.dev.yml down

seed:
	docker compose -f deploy/docker-compose.dev.yml exec api node dist/prisma/seed-runner.js
