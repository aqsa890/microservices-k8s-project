# NexusBoard — Microservices Dashboard

A small microservices project with a **Frontend**, **Backend**, and **API Gateway** that communicate through port `3333`.

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Frontend   │────▶│   API Gateway    │────▶│  Backend Service │
│  :3000       │     │  :3333           │     │  :4000           │
│  (Static UI) │     │  (Reverse Proxy) │     │  (REST API)      │
└─────────────┘     └──────────────────┘     └──────────────────┘
```

## Services

| Service  | Port | Description                     |
|----------|------|---------------------------------|
| Frontend | 3000 | Static dashboard UI (Express)   |
| Gateway  | 3333 | API proxy & routing             |
| Backend  | 4000 | REST API (Users & Products)     |

## Quick Start

### 1. Environment Variable Configuration
Each directory has a `.env` file (configured based on its `.env.example` file):
- **Backend (`backend/.env`)**: Define database connections and port configuration.
- **Gateway (`gateway/.env`)**: Define target backend URL and proxy ports.
- **Frontend (`frontend/.env`)**: Define the public-facing Gateway URL so the browser can reach it.

### 2. Local Development (Native Node.js)

First, install dependencies:
```bash
npm run install-all
```

Then, run all services concurrently:
```bash
npm run dev
```

### 3. Running with Docker Compose

You can build and spin up the complete containerized environment (including MongoDB):
```bash
# Build the Docker images
docker-compose build

# Spin up all containers
docker-compose up
```

Once running, visit [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints (via Gateway :3333)

| Method | Endpoint           | Description       |
|--------|--------------------|--------------------|
| GET    | /api/users         | List all users     |
| POST   | /api/users         | Create a user      |
| DELETE | /api/users/:id     | Delete a user      |
| GET    | /api/products      | List all products  |
| POST   | /api/products      | Create a product   |
| DELETE | /api/products/:id  | Delete a product   |
| GET    | /health            | Gateway health     |
| GET    | /gateway/info      | Gateway info       |
