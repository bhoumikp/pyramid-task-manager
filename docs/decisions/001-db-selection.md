# ADR-001: Database Selection

## Decision

PostgreSQL + Prisma

## Context

The assignment gives us freedom to choose the database, so we should select one that fits the application's requirements.

## Reason

- PostgreSQL fits the relational nature of our application and provides strong support for relationships, constraints, transactions, and structured querying.

- Prisma provides a type-safe database client/API generated from our schema. It abstracts much of the database interaction, while Prisma handles translating operations into database queries.

## Alternatives

- MongoDB + Mongoose
- MySQL
