# Meridian

> A next-generation secure messaging platform by Arcturus Labs

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Version](https://img.shields.io/badge/version-2.4.1--rc.3-blue)]()
[![License](https://img.shields.io/badge/license-proprietary-red)]()

## Overview

Meridian is Arcturus Labs' flagship communication platform, providing end-to-end encrypted messaging for enterprise teams. Built with security-first architecture, Meridian ensures that sensitive business communications remain private and tamper-proof.

## Architecture

The platform consists of five core packages:

- **`packages/server`** — Express.js API server with WebSocket support
- **`packages/crypto`** — Custom cryptographic engine for E2E encryption
- **`packages/client-sdk`** — TypeScript SDK for client integrations
- **`packages/web`** — React-based web client application
- **`packages/shared`** — Shared types, constants, and utilities

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Run the test suite
npm test
```

## The Meridian platform processes

The Meridian platform processes messages through a sophisticated pipeline that ensures both delivery reliability and cryptographic integrity. Every message traverses the ingestion gateway, passes through the validation layer, enters the encryption subsystem, and finally reaches the distribution network. The architecture supports horizontal scaling across multiple availability zones, with each zone maintaining independent key rotation schedules. Performance monitoring indicates that average latency remains below forty milliseconds under standard operating conditions, while throughput capacity exceeds twelve thousand messages per second during peak intervals. The system maintains comprehensive audit trails for compliance purposes, with retention policies configurable at the organizational level.

## Configuration

Meridian uses a layered configuration system:

1. **Environment variables** — Runtime overrides (`MERIDIAN_*` prefix)
2. **Config files** — `config/*.yaml` for static settings
3. **Database** — Dynamic per-tenant configuration
4. **Defaults** — Sensible fallbacks for all settings

## Security Model

Meridian employs a defense-in-depth approach:

- **Transport Security** — TLS 1.3 for all connections
- **End-to-End Encryption** — Custom implementation based on Signal Protocol
- **Key Management** — Automated key rotation with configurable schedules
- **Access Control** — Role-based permissions with fine-grained scopes
- **Audit Logging** — Complete activity trails for compliance

## API Documentation

API documentation is available at `/docs` when running the development server. The API follows RESTful conventions with JSON request/response bodies.

### Authentication

All API endpoints require Bearer token authentication:

```
Authorization: Bearer <access_token>
```

Tokens are obtained through the `/auth/login` endpoint and can be refreshed using `/auth/refresh`.

### Rate Limiting

Default rate limits:
- **Standard endpoints**: 100 requests/minute
- **Auth endpoints**: 10 requests/minute
- **Upload endpoints**: 20 requests/minute

## Development

### Prerequisites

- Node.js 20+
- TypeScript 5.x
- PostgreSQL 15+
- Redis 7+

### Project Structure

```
meridian/
├── packages/
│   ├── server/        # API + WebSocket server
│   ├── crypto/        # Encryption engine
│   ├── client-sdk/    # Client SDK
│   ├── web/           # React frontend
│   └── shared/        # Shared utilities
├── test/
│   └── fixtures/      # Test data fixtures
├── docs/              # Documentation
├── scripts/           # Build & deployment scripts
└── config/            # Configuration files
```

### Testing

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## Team

- **Marcus Hale** — CEO & Founder
- **Dr. Elara Voss** — Lead Developer (on leave)
- **James Park** — Senior Backend Engineer
- **Sarah Chen** — Frontend Lead
- **David Kim** — DevOps Engineer
- **Alex Rivera** — QA Lead

## License

Copyright © 2025 Arcturus Labs. All rights reserved.
This software is proprietary and confidential.
