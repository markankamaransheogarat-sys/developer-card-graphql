# Пресс-релиз: Developer Card GraphQL API v1.0.0

**Дата:** 20 ноября 2026  
**Репозиторий:** https://github.com/markankamaransheogarat-sys/developer-card-graphql  

## Заголовок
**Developer Card GraphQL API v1.0.0 — NestJS + Prisma + Apollo GraphQL API цифровой визитки с DataLoader (N+1 prevention)**

## Ключевые возможности
- **NestJS + Apollo GraphQL + Prisma ORM + PostgreSQL** с готовыми миграциями и сидами (`prisma/seed.ts`).
- **Защита от N+1 запросов** через `BatchDataLoader` с инвалидацией кэша при мутациях (`addSkill`, `addProject`).
- **Docker & Docker Compose** для быстрого развёртывания.
- **3/3 интеграционных тестов** и `nest build` проходят, добавлен GitHub Actions CI.
