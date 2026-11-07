# Developer Digital Business Card — GraphQL Backend (NestJS + Prisma + PostgreSQL + Docker)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.4-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![GraphQL](https://img.shields.io/badge/GraphQL-Apollo_Sandbox-E10098?logo=graphql&logoColor=white)](https://www.apollographql.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

Backend-приложение **«Цифровая визитка разработчика»** (Digital Business Card API), разработанное на стеке **TypeScript, Node.js, NestJS, Prisma ORM, PostgreSQL, GraphQL (Apollo Server 4 + Apollo Sandbox) и Docker**.

### 🌐 Живой стенд (Live Demo / Apollo Sandbox):
- **Apollo Sandbox GraphQL IDE (Cloudflare CDN):** **[https://card.404nfd.net/graphql](https://card.404nfd.net/graphql)**
- **Прямое зеркало без Cloudflare (для провайдеров РФ без VPN):** **[http://404nfd.net/graphql](http://404nfd.net/graphql)** / **[https://404nfd.net:8443/graphql](https://404nfd.net:8443/graphql)**
- **Healthcheck Endpoint:** **[https://card.404nfd.net/health](https://card.404nfd.net/health)** ([http://404nfd.net/health](http://404nfd.net/health))
- **GitHub Repository:** **[https://github.com/markankamaransheogarat-sys/developer-card-graphql](https://github.com/markankamaransheogarat-sys/developer-card-graphql)**

---

## Содержание

1. [Быстрый старт (Zero-Config Launch)](#1-быстрый-старт-zero-config-launch)
2. [Примеры GraphQL-запросов в Apollo Sandbox](#2-примеры-graphql-запросов-в-apollo-sandbox)
3. [Обоснование архитектурных решений](#3-обоснование-архитектурных-решений)
   - [3.1. Структура приложения и разделение ответственности (Clean Layered Architecture)](#31-структура-приложения-и-разделение-ответственности-clean-layered-architecture)
   - [3.2. Оптимизация вложенных запросов GraphQL и решение проблемы N+1 (Request-Scoped DataLoader)](#32-оптимизация-вложенных-запросов-graphql-и-решение-проблемы-n1-request-scoped-dataloader)
   - [3.3. Проектирование схемы БД PostgreSQL и индексов](#33-проектирование-схемы-бд-postgresql-и-индексов)
   - [3.4. Автоматическая инициализация и идемпотентное заполнение БД при старте с нуля](#34-автоматическая-инициализация-и-идемпотентное-заполнение-бд-при-старте-с-нуля)
4. [Тестирование](#4-тестирование)

---

## 1. Быстрый старт (Zero-Config Launch)

### Вариант А: Запуск одной командой через Docker Compose (рекомендуется)

```bash
git clone https://github.com/markankamaransheogarat-sys/developer-card-graphql.git
cd developer-card-graphql
docker compose up --build -d
```

При старте контейнера `api`:
1. Дожидается готовности контейнера `postgres` (`service_healthy` через `pg_isready`).
2. Автоматически накатывает миграции (`npx prisma migrate deploy`).
3. При старте NestJS (`DatabaseInitializerService.onModuleInit`) автоматически проверяет наличие профиля в БД и в единой ACID-транзакции заполняет таблицы `profiles`, `social_links`, `skills`, `experiences` и `projects` данными разработчика.
4. Поднимает **Apollo Sandbox IDE** по адресу: **`http://localhost:3000/graphql`** (корень `/` также автоматически перенаправляет на `/graphql`, а `/health` отдаёт JSON-статус сервиса).

### Вариант Б: Локальный запуск без Docker

```bash
cp .env.example .env
npm install
npx prisma migrate deploy
npm run build
npm start
```

---

## 2. Примеры GraphQL-запросов в Apollo Sandbox

### Запрос из технического задания (получение профиля и всех связанных сущностей)

```graphql
query {
  profile {
    name
    description
    skills {
      name
    }
    experience {
      company
      position
    }
    projects {
      name
    }
  }
}
```

### Расширенный запрос со всеми полями, ссылками и фильтрацией

```graphql
query GetFullDeveloperCard {
  profile {
    id
    name
    title
    description
    location
    timezone
    available
    links {
      platform
      label
      url
    }
    skills(category: "BACKEND") {
      name
      category
      proficiencyPercent
      yearsOfExperience
    }
    experience {
      company
      position
      period
      isCurrent
      achievements
      technologies
    }
    projects(featuredOnly: true) {
      name
      description
      link
      url
      repositoryUrl
      techStack
      highlights
      featured
    }
  }
}
```

### Мутация (добавление нового навыка или проекта во время демонстрации)

```graphql
mutation AddNewSkill {
  addSkill(
    input: {
      name: "GraphQL Federation"
      category: "BACKEND"
      proficiencyPercent: 95
      yearsOfExperience: 4
    }
  ) {
    id
    name
    category
    proficiencyPercent
  }
}
```

---

## 3. Обоснование архитектурных решений

### 3.1. Структура приложения и разделение ответственности (Clean Layered Architecture)

Кодовая база строго разделена на 4 изолированных слоя, чтобы исключить протекание деталей хранения (Prisma) в слой представления (GraphQL) и наоборот:

```text
src/
├── main.ts                                  # Точка входа, глобальная валидация DTO, CORS, /health
├── app.module.ts                            # Конфигурация ApolloDriver + встроенный Apollo Sandbox
├── common/
│   └── dataloader/
│       └── batch-loader.ts                  # Tick-coalescing BatchDataLoader (дедупликация и батчинг)
├── database/
│   ├── prisma.module.ts                     # Глобальный модуль инфраструктуры БД
│   ├── prisma.service.ts                    # Управление жизненным циклом соединения PrismaClient
│   ├── database-initializer.service.ts      # Автоматический идемпотентный сидинг при запуске с нуля
│   └── seed-data.ts                         # Канонические данные профиля, навыков, опыта и проектов
└── profile/
    ├── profile.module.ts                    # Модуль домена цифровой визитки
    ├── resolvers/
    │   └── profile.resolver.ts              # Слой представления (GraphQL Queries, @ResolveField, Mutations)
    ├── services/
    │   ├── profile.service.ts               # Бизнес-логика (фильтрация по категориям, правила домена)
    │   └── profile-dataloader.service.ts    # Request-scoped координатор батч-загрузки связей 1:N
    ├── repositories/
    │   └── profile.repository.ts            # Слой доступа к данным (изолированные запросы Prisma ORM)
    ├── models/                              # Code-First GraphQL ObjectTypes (@ObjectType, @Field)
    └── dto/                                 # Входные контракты с валидацией (class-validator)
```

**Почему выбрано такое разделение:**
1. **`ProfileResolver` (Presentation Layer)** отвечает исключительно за маппинг GraphQL-запросов, аргументов и полевых резолверов (`@ResolveField`). В нём нет ни одного прямого обращения к `PrismaService`.
2. **`ProfileService` (Business Logic Layer)** инкапсулирует доменные правила (проверку существования профиля, нормализацию и фильтрацию навыков по категориям, фильтрацию избранных проектов).
3. **`ProfileRepository` (Data Access Layer)** — единственное место, которое знает о структуре таблиц Prisma и формирует батч-выборки `WHERE profile_id IN (...)`.
4. **Code-First подход (`@nestjs/graphql`)** генерирует GraphQL-схему напрямую из TypeScript-классов и декораторов, гарантируя 100% синхронизацию между типами компилятора TypeScript и GraphQL SDL без дублирования `.graphql` файлов.

---

### 3.2. Оптимизация вложенных запросов GraphQL и решение проблемы N+1 (Request-Scoped DataLoader)

В наивных реализациях GraphQL можно встретить две крайности:
- **Антипаттерн 1 (Eager Over-fetching):** делать `prisma.profile.findUnique({ include: { skills: true, experience: true, projects: true, links: true } })` в корневом `@Query() profile`. Если клиент запрашивает только `{ profile { name } }`, БД впустую выполняет 4 `JOIN`-запроса.
- **Антипаттерн 2 (N+1 Query Problem):** выносить `skills`, `experience`, `projects` в `@ResolveField()`, но внутри каждого вызывать одиночный `findMany({ where: { profileId } })`. При списке профилей это порождает $1 + 4N$ запросов к БД.

**Наше инженерное решение:**
1. **Ленивое разрешение полей (`@ResolveField`)**: корневой запрос `getProfile()` загружает **только** строку таблицы `profiles`. Если клиент не запросил `projects` или `experience`, запросы к этим таблицам **вообще не выполняются**.
2. **Request-Scoped `ProfileDataLoaderService` (`@Injectable({ scope: Scope.REQUEST })`) + `BatchDataLoader`**:
   - Для каждого входящего GraphQL HTTP-запроса создаётся изолированный экземпляр `ProfileDataLoaderService`.
   - Все вызовы `.load(profile.id)` в рамках одного тика Event Loop (`process.nextTick`) агрегируются, дедуплицируются по ключу и отправляются в `ProfileRepository` одним батч-запросом `WHERE profile_id IN (...) ORDER BY sort_order ASC`.
   - При вызове мутаций (`addSkill`, `addProject`) кэш DataLoader'а текущего запроса принудительно сбрасывается (`clearAllCaches()`), исключая возврат устаревших данных.

---

### 3.3. Проектирование схемы БД PostgreSQL и индексов

Схема БД (`prisma/schema.prisma`) спроектирована в 3-й нормальной форме (3NF) с каскадным удалением (`onDelete: Cascade`) и целевыми составными B-Tree индексами под паттерны чтения DataLoader'а:

- `profiles` (`id` UUID PK, `slug` UNIQUE)
- `social_links` — индекс `@@index([profileId, sortOrder])`
- `skills` — индексы `@@index([profileId, sortOrder])` и `@@index([profileId, category])`
- `experiences` — индекс `@@index([profileId, sortOrder])`
- `projects` — индекс `@@index([profileId, sortOrder])`

Благодаря составному индексу `(profile_id, sort_order)` запрос DataLoader'а `WHERE profile_id IN (...) ORDER BY sort_order ASC` выполняется за один `Index Scan` без дополнительной сортировки (`Sort` node) в плане выполнения PostgreSQL.

---

### 3.4. Автоматическая инициализация и идемпотентное заполнение БД при старте с нуля

По условию задания: *«При запуске приложения база данных должна быть автоматически подготовлена и заполнена Вашими данными»*.

Это реализовано на двух уровнях:
1. **Миграции схемы:** в `start:prod` (`Dockerfile`) перед запуском приложения автоматически выполняется `npx prisma migrate deploy`, применяющий SQL-миграцию из `prisma/migrations/20261107000000_init/migration.sql`.
2. **Авто-заполнение при старте (`DatabaseInitializerService implements OnModuleInit`):**
   - При инициализации модуля NestJS сервис проверяет `await this.prisma.profile.count()`.
   - Если база данных пуста (первый запуск с нуля), сервис внутри `this.prisma.$transaction(...)` идемпотентно создаёт профиль и все связанные записи (`social_links`, `skills`, `experiences`, `projects`).
   - Дополнительно поддерживается стандартная команда `npm run prisma:seed` (`npx prisma db seed`).

---

## 4. Тестирование

Для проверки батчинга `BatchDataLoader` (защиты от N+1), работы резолверов, фильтрации и мутаций написан набор автоматических тестов:

```bash
npm test
```
