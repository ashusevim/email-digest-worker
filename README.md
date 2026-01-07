# Email Digest Worker

A TypeScript-based worker application for processing email digests using BullMQ and Redis.

## Description

This project implements a job queue system for handling email digest processing. It consists of three main components:

- **Producer**: Adds jobs to the queue for email digest processing
- **Worker**: Processes jobs from the queue, simulating email sending with potential failures
- **Scheduler**: Schedules recurring digest jobs

## Prerequisites

- Node.js (v14 or higher)
- Redis server running on localhost:6379

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development

Run in development mode with hot reloading:
```bash
npm run dev
```

### Build

Compile TypeScript to JavaScript:
```bash
npm run build
```

### Production

Build and start the application:
```bash
npm run build
npm start
```

### Running Components

You can run the individual components directly:

- Producer: `npx ts-node src/producer.ts`
- Worker: `npx ts-node src/worker.ts`
- Scheduler: `npx ts-node src/scheduler.ts`

## Dependencies

- **bullmq**: Redis-based queue for Node.js
- **ioredis**: Redis client for Node.js
- **express**: Web framework (though not actively used in current code)
- **dotenv**: Environment variable management

## Configuration

The application connects to Redis on `127.0.0.1:6379`. You can modify the connection settings in each file if needed.

## License

ISC