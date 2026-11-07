/**
 * Canonical Seed Data — Konstantin (@markankamaransheogarat-sys)
 * Used both by CLI `prisma db seed` (`prisma/seed.ts`) and automatic
 * `DatabaseInitializerService` (`OnModuleInit`) on application startup.
 */

export interface SeedProfilePayload {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  location: string;
  timezone: string;
  available: boolean;
  links: Array<{
    id: string;
    platform: string;
    label: string;
    url: string;
    sortOrder: number;
  }>;
  skills: Array<{
    id: string;
    name: string;
    category: string;
    proficiencyPercent: number;
    yearsOfExperience: number;
    sortOrder: number;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    period: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    achievements: string[];
    technologies: string[];
    sortOrder: number;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    url: string;
    repositoryUrl: string;
    techStack: string[];
    highlights: string[];
    featured: boolean;
    sortOrder: number;
  }>;
}

export const KONSTANTIN_PROFILE_SEED: SeedProfilePayload = {
  id: "00000000-0000-4000-8000-000000000001",
  slug: "primary",
  name: "Константин (Konstantin)",
  title: "Senior TypeScript Backend & Distributed Systems Engineer",
  description:
    "Senior Backend Engineer specializing in high-throughput TypeScript/Node.js architectures, NestJS, GraphQL (Apollo), Prisma ORM, PostgreSQL optimization, S3 object storage, Docker containerization, and AI-augmented engineering (Claude Code, Multi-Agent RAG). Proven track record building low-latency financial & quantitative platforms, distributed APIs, and fault-tolerant backend microservices.",
  location: "Remote (Worldwide)",
  timezone:
    "UTC / UTC+3 (Available 12:00–14:00 UTC mandatory window & full 8h schedule)",
  available: true,
  links: [
    {
      id: "00000000-0000-4000-8000-000000000101",
      platform: "GitHub",
      label: "GitHub (@markankamaransheogarat-sys)",
      url: "https://github.com/markankamaransheogarat-sys",
      sortOrder: 1,
    },
    {
      id: "00000000-0000-4000-8000-000000000102",
      platform: "Portfolio",
      label: "Live Flagship App — APEX // TERMINAL v6.0",
      url: "https://markankamaransheogarat-sys.github.io/apex-terminal/",
      sortOrder: 2,
    },
    {
      id: "00000000-0000-4000-8000-000000000103",
      platform: "Email",
      label: "markankamaransheogarat@gmail.com",
      url: "mailto:markankamaransheogarat@gmail.com",
      sortOrder: 3,
    },
  ],
  skills: [
    {
      id: "00000000-0000-4000-8000-000000000201",
      name: "TypeScript (Strict Mode, Generics, Decorators, AST)",
      category: "BACKEND",
      proficiencyPercent: 99,
      yearsOfExperience: 6.0,
      sortOrder: 1,
    },
    {
      id: "00000000-0000-4000-8000-000000000202",
      name: "Node.js (Event Loop, Streams, Worker Threads, High-Concurrency)",
      category: "BACKEND",
      proficiencyPercent: 98,
      yearsOfExperience: 6.0,
      sortOrder: 2,
    },
    {
      id: "00000000-0000-4000-8000-000000000203",
      name: "NestJS (Modular DI, Guards, Interceptors, Lifecycle Hooks, Microservices)",
      category: "BACKEND",
      proficiencyPercent: 97,
      yearsOfExperience: 5.0,
      sortOrder: 3,
    },
    {
      id: "00000000-0000-4000-8000-000000000204",
      name: "GraphQL & Apollo Server (Code-First Schema, DataLoader N+1 Optimization, AST Lookahead)",
      category: "BACKEND",
      proficiencyPercent: 96,
      yearsOfExperience: 4.5,
      sortOrder: 4,
    },
    {
      id: "00000000-0000-4000-8000-000000000205",
      name: "PostgreSQL (B-Tree/GIN Indexing, Query Planning, ACID Transactions, Partitioning)",
      category: "DATABASE",
      proficiencyPercent: 96,
      yearsOfExperience: 6.0,
      sortOrder: 5,
    },
    {
      id: "00000000-0000-4000-8000-000000000206",
      name: "Prisma ORM (Migrations, Interactive Transactions, Relation Batching, Seeding)",
      category: "DATABASE",
      proficiencyPercent: 97,
      yearsOfExperience: 4.5,
      sortOrder: 6,
    },
    {
      id: "00000000-0000-4000-8000-000000000207",
      name: "Docker & Docker Compose (Multi-Stage Builds, Healthchecks, Zero-Downtime Entrypoints)",
      category: "DEVOPS_CLOUD",
      proficiencyPercent: 95,
      yearsOfExperience: 5.0,
      sortOrder: 7,
    },
    {
      id: "00000000-0000-4000-8000-000000000208",
      name: "S3 Storage (AWS S3 / MinIO / Presigned URLs, Multipart Streaming Uploads)",
      category: "DEVOPS_CLOUD",
      proficiencyPercent: 94,
      yearsOfExperience: 4.5,
      sortOrder: 8,
    },
    {
      id: "00000000-0000-4000-8000-000000000209",
      name: "Git & CI/CD (GitHub Actions, Trunk-Based Workflows, Automated Quality Gates)",
      category: "DEVOPS_CLOUD",
      proficiencyPercent: 98,
      yearsOfExperience: 6.0,
      sortOrder: 9,
    },
    {
      id: "00000000-0000-4000-8000-000000000210",
      name: "Claude Code & AI Agentic Engineering (MCP Servers, Context Optimization, TDD Automation)",
      category: "AI_ENGINEERING",
      proficiencyPercent: 99,
      yearsOfExperience: 2.5,
      sortOrder: 10,
    },
  ],
  experience: [
    {
      id: "00000000-0000-4000-8000-000000000301",
      company: "Apex FinTech & Quantitative Systems (Independent / Contract)",
      position: "Senior TypeScript Backend & Systems Architect",
      period: "2023 — Present",
      startDate: "2023-03",
      endDate: null,
      isCurrent: true,
      achievements: [
        "Architected high-frequency TypeScript/Node.js data ingestion pipelines processing real-time WebSocket streams (Binance, Bybit, OKX, Deribit) with sub-millisecond latency.",
        "Designed and deployed GraphQL & REST backend services with NestJS, Prisma, and PostgreSQL, eliminating N+1 query bottlenecks via request-scoped DataLoaders and composite B-Tree indexing (reducing p99 response time by 74%).",
        "Built S3-compatible archival pipelines and automated Docker Compose / GitHub Actions deployment workflows with 100% automated unit & integration test coverage.",
        "Pioneered AI-augmented engineering workflows with Claude Code and custom MCP servers, accelerating feature delivery 3.5x while maintaining strict zero-regression test gates.",
      ],
      technologies: [
        "TypeScript",
        "NestJS",
        "PostgreSQL",
        "Prisma",
        "GraphQL",
        "Docker",
        "S3 Storage",
        "Claude Code",
      ],
      sortOrder: 1,
    },
    {
      id: "00000000-0000-4000-8000-000000000302",
      company: "Enterprise Cloud & SaaS Platforms",
      position: "Backend TypeScript / Node.js Developer",
      period: "2021 — 2023",
      startDate: "2021-02",
      endDate: "2023-02",
      isCurrent: false,
      achievements: [
        "Developed core backend modules for high-load SaaS & charity/crowdfunding payment processing systems using NestJS, PostgreSQL, Prisma, and GraphQL.",
        "Implemented secure S3 document & media storage with presigned URLs, role-based access control (RBAC), and audit logging.",
        "Optimized complex relational reporting queries in PostgreSQL and introduced automated database migrations and seed pipelines in Docker.",
      ],
      technologies: [
        "TypeScript",
        "Node.js",
        "NestJS",
        "PostgreSQL",
        "Prisma",
        "GraphQL",
        "S3 Storage",
        "Docker",
        "Git",
      ],
      sortOrder: 2,
    },
    {
      id: "00000000-0000-4000-8000-000000000303",
      company: "Digital Web & API Studio",
      position: "Full-Stack TypeScript Developer",
      period: "2019 — 2021",
      startDate: "2019-06",
      endDate: "2021-01",
      isCurrent: false,
      achievements: [
        "Built 15+ production web applications and GraphQL/REST APIs in TypeScript and Node.js.",
        "Established unit and E2E testing standards, containerized local development environments with Docker Compose, and reduced deployment rollbacks to near zero.",
      ],
      technologies: [
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "GraphQL",
        "Docker",
        "Git",
      ],
      sortOrder: 3,
    },
  ],
  projects: [
    {
      id: "00000000-0000-4000-8000-000000000401",
      name: "APEX // TERMINAL v6.0 — Institutional Quant & Orderflow Platform",
      description:
        "Bloomberg/Aladdin-grade real-time crypto quantitative terminal in TypeScript: 1,000-level L2 Orderbook Stoikov Micro-Price & Spoofing Radar, 24h Whale Iceberg Clustering, 6-Factor Quant Alpha Engine, BlackRock VaR Risk Matrix, and 60 FPS TradingView Superchart with Smart Money Concepts (BOS/CHoCH/FVG/OB). 105/105 automated tests.",
      url: "https://markankamaransheogarat-sys.github.io/apex-terminal/",
      repositoryUrl:
        "https://github.com/markankamaransheogarat-sys/apex-terminal",
      techStack: [
        "TypeScript",
        "Node.js",
        "WebSockets",
        "HTML5 Canvas",
        "Quant Math",
      ],
      highlights: [
        "15 specialized institutional modules & 105 passing unit/integration tests",
        "Real-time multi-venue WebSocket aggregation (Binance, Bybit, OKX, Deribit, Mempool)",
        "60-Day Walk-Forward Strategy Backtester & Kelly Criterion Execution Calculator",
      ],
      featured: true,
      sortOrder: 1,
    },
    {
      id: "00000000-0000-4000-8000-000000000402",
      name: "Tabularis — SQL Workspace with Built-in Claude Code / Cursor MCP Server",
      description:
        "Desktop & backend SQL workspace supporting PostgreSQL, ClickHouse, DuckDB, SQL Server, and Redis with a built-in Model Context Protocol (MCP) server for Claude Code and Cursor, interactive SQL notebooks, and visual EXPLAIN query plan analysis.",
      url: "https://github.com/markankamaransheogarat-sys/tabularis",
      repositoryUrl: "https://github.com/markankamaransheogarat-sys/tabularis",
      techStack: [
        "TypeScript",
        "PostgreSQL",
        "MCP Server",
        "Claude Code",
        "SQL",
      ],
      highlights: [
        "3 built-in database drivers and 24 driver plugins including PostgreSQL & ClickHouse",
        "Native MCP integration for AI coding agents (Claude Code, Cursor, Devin)",
        "Visual EXPLAIN query plan analyzer for database indexing optimization",
      ],
      featured: true,
      sortOrder: 2,
    },
    {
      id: "00000000-0000-4000-8000-000000000403",
      name: "Cortex Agent RAG — Production Multi-Agent RAG & Semantic Cache Engine",
      description:
        "Production Multi-Agent Retrieval-Augmented Generation engine featuring Hybrid Dense + BM25 search, Cross-Encoder reranking, semantic caching, and deterministic hallucination guardrails.",
      url: "https://github.com/markankamaransheogarat-sys/cortex-agent-rag",
      repositoryUrl:
        "https://github.com/markankamaransheogarat-sys/cortex-agent-rag",
      techStack: [
        "TypeScript",
        "Python",
        "Vector DB",
        "Hybrid BM25",
        "LLM Agents",
      ],
      highlights: [
        "Sub-50ms semantic cache hit path reducing upstream API costs by 68%",
        "Cross-Encoder reranking & citation verification guardrails",
      ],
      featured: true,
      sortOrder: 3,
    },
    {
      id: "00000000-0000-4000-8000-000000000404",
      name: "Token Sentinel — AI Coding Agent Context Proxy & Package Firewall",
      description:
        "Local context budget guardian, deduplication proxy, and phantom package hallucination firewall built for Claude Code, Cursor, Cline, and Aider workflows.",
      url: "https://github.com/markankamaransheogarat-sys/token-sentinel",
      repositoryUrl:
        "https://github.com/markankamaransheogarat-sys/token-sentinel",
      techStack: ["Rust", "TypeScript", "Claude Code", "AST Security", "Proxy"],
      highlights: [
        "Real-time AST & registry verification preventing supply-chain package hallucinations",
        "Context window deduplication saving 35-50% token overhead in large monorepos",
      ],
      featured: true,
      sortOrder: 4,
    },
    {
      id: "00000000-0000-4000-8000-000000000405",
      name: "Money Radar — Local-First Personal Finance & Subscription Analytics",
      description:
        "Zero-dependency financial analytics dashboard, recurring subscription watchdog, and cashflow forecasting engine with full test coverage.",
      url: "https://markankamaransheogarat-sys.github.io/money-radar/",
      repositoryUrl:
        "https://github.com/markankamaransheogarat-sys/money-radar",
      techStack: [
        "TypeScript",
        "Node.js",
        "Clean Architecture",
        "Automated Tests",
      ],
      highlights: [
        "Deterministic recurring burn-rate & cashflow projection engine",
        "100% unit test coverage across financial calculation modules",
      ],
      featured: true,
      sortOrder: 5,
    },
  ],
};
