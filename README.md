# Fibertime Fullstack Application

A fullstack web application featuring a NestJS backend and a React frontend, containerized with Docker and orchestrated via Docker Compose. The backend uses PostgreSQL and Redis for data and cache management.

---

## Table of Contents

- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Usage](#api-usage)
  - [Auth Endpoints](#auth-endpoints)
  - [Device Endpoints](#device-endpoints)
- [Frontend Usage](#frontend-usage)
- [Database Migration](#database-migration)
- [Development Notes](#development-notes)

---

## Setup Locally

**Prerequisites**

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

**Steps**

1. **Clone the repository** and navigate to the project root.

2. **Create a `.env` file** at the root with necessary environment variables (see [Environment Variables](#environment-variables)).

3. **Start all services:**

   ```bash
   docker-compose up --build
   ```

   This will start:

   - `nginx` (reverse proxy)
   - `fibertime-fe` (React frontend)
   - `fibertime-be` (NestJS backend)
   - `fibertime-db` (PostgreSQL database)
   - `redis` (Redis cache)

4. **Access the application:**
   - Frontend: [http://localhost](http://localhost)
   - Backend API: [http://localhost/api](http://localhost/api) (proxied by nginx)

---

## Environment Variables

Create a `.env` file in the root directory. Common variables:

```
# Backend
POSTGRES_USER=<db-user>
POSTGRES_PASSWORD=<db-password>
POSTGRES_DB=<db-name>
DATABASE_URL=<db-url>
REDIS_URL=<redis-url>

# Frontend
NEXT_PUBLIC_API_BASE_URL=<api-base-url>
```

---

## Database Schema

The application uses PostgreSQL. The main tables and relationships are:

| Table          | Columns                                                                                                                                   | Notes                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `bundle`       | id (uuid, PK), name (string, nullable), expirationDate (timestamp, required)                                                              | Represents a bundle to which devices can be connected.   |
| `pairing_code` | id (uuid, PK), code (string, 4 chars, unique), expiresAt (timestamp), status (default: 'active'), createdAt                               | Used for device pairing.                                 |
| `device`       | id (uuid, PK), macAddress (string, required), status (default: 'disconnected'), createdAt, userId (FK), bundleId (FK), pairingCodeId (FK) | Devices are linked to users, bundles, and pairing codes. |
| `user`         | id (uuid, PK), phoneNumber (unique), createdAt, role (default: 'user')                                                                    | Users authenticate via phone number and OTP.             |
| `otp`          | id (uuid, PK), phoneNumber, otp, createdAt, status (default: 'pending'), expiresAt                                                        | Stores OTP codes for authentication.                     |

**Relationships:**

- `device.userId` → `user.id`
- `device.bundleId` → `bundle.id`
- `device.pairingCodeId` → `pairing_code.id`

---

## API Usage

All endpoints are prefixed with `/api`.

### Auth Endpoints

| Endpoint                | Method | Body                                   | Description                                        |
| ----------------------- | ------ | -------------------------------------- | -------------------------------------------------- |
| `/api/auth/request-otp` | POST   | `{ phoneNumber: string }`              | Request an OTP for login (rate limited: 5/min)[5]. |
| `/api/auth/login`       | POST   | `{ phoneNumber: string, otp: string }` | Login and receive a JWT access token[5].           |

**Example:**

```json
POST /api/auth/request-otp
{
  "phoneNumber": "<phone-number>"
}
```

```json
POST /api/auth/login
{
  "phoneNumber": "<phone-number>",
  "otp": "<otp>"
}
```

---

### Device Endpoints

All device endpoints require a valid JWT (`Authorization: Bearer `).

| Endpoint                         | Method | Body/Query                               | Description                                   |
| -------------------------------- | ------ | ---------------------------------------- | --------------------------------------------- |
| `/api/device/create-device-code` | POST   | `{ userId: string, macAddress: string }` | Generate a 4-character device pairing code.   |
| `/api/device`                    | GET    | `?code=`                                 | Get device info by pairing code.              |
| `/api/device/connect-device`     | POST   | `{ deviceCode: string }`                 | Connect device to a bundle using device code. |
| `/api/device/connection-status`  | GET    | `?code=`                                 | Check if device connection is successful.     |

**Example:**

```json
POST /api/device/create-device-code
{
  "userId": "<user-id>",
  "macAddress": "<mac-address>"
}
```

---

## Frontend Usage

The React frontend communicates with the backend using the following API methods (see `fibertime_fe/api.ts`)[3]:

- `requestOTP(phoneNumber)`
- `login(phoneNumber, otp)`
- `createDeviceCode(accessToken, userId, macAddress)`
- `connectDevice(accessToken, deviceCode)`
- `getDeviceStatus(accessToken, deviceCode)`

Configure the frontend to point to the correct backend URL using the `NEXT_PUBLIC_API_BASE_URL` environment variable.

---

## Database Migration

**Creating a Migration**

```bash
docker compose exec fibertime-be npm run migration:generate --name
```

**Running a Migration**

```bash
docker compose exec fibertime-be npm run migration:run
```

**Reverting a Migration**

```bash
docker compose exec fibertime-be npm run migration:revert
```

---

## Development Notes

- All services are run in Docker containers; code changes in `fibertime_fe` and `fibertime_be` are reflected live due to mounted volumes.
- Database migrations are managed via TypeORM in the backend. Run migrations as needed after schema changes.
- Nginx acts as a reverse proxy, routing frontend and API requests.
