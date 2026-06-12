# Eventlit
Eventlit is a high-performance, open-source event management and ticketing platform designed for massive scale. Built with a modern Next.js and backend monorepo architecture, it features a low-latency checkout engine, dynamic surge pricing, Web 3 ticket gating, and real-time waitlist notifications to prevent crashes during high-demand ticket drops.

eventlit/
├── apps/
│   ├── api-core/               # Main REST/GraphQL engine (Rust/Go or Node)
│   ├── engine-checkout/        # Low-latency transaction/queue node
│   ├── service-notifications/  # Real-time WebSockets & push alerts
│   ├── web-marketplace/        # Next.js user-facing discovery (eventlit.com)
│   └── web-dashboard/          # Next.js organizer portal (manage.eventlit.com)
├── packages/
│   ├── database/               # Prisma/Drizzle schema
│   ├── queue/                  # BullMQ/Redis configuration for the waiting room
│   ├── types/                  # Shared TypeScript definitions
│   └── ui/                     # Shared Eventlit design system (Tailwind)
├── docker-compose.yml          # Local infra (Postgres, Redis, Kafka)
├── package.json
└── turbo.json
