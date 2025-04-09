# 📁 File Management System (FMS)

A secure, version-controlled File Management System built with **Node.js**, **Express**, **PostgreSQL**, and **Prisma ORM**.

This system supports:
- User authentication
- Folder hierarchy (nested folders)
- Document upload
- Versioning (1.0, 1.1, etc.)
- Filtering with folder path
- RESTful API with secure endpoints

---

## 📐 Architecture Decisions

### Tech Stack

| Layer       | Technology         |
|-------------|--------------------|
| Backend     | Node.js + Express  |
| ORM         | Prisma ORM         |
| Database    | PostgreSQL         |
| File Upload | `multer` (local simulation) |
| Auth        | JWT (via `auth.middleware.js`) |
| API Testing | Postman (collection provided) |

### Database Schema

- `User`: Handles authentication and ownership.
- `Folder`: Represents a hierarchical structure with `parentFolder`.
- `Document`: Belongs to a folder, created by a user.
- `Version`: Tracks document versions (1.0, 1.1, etc.) with file URL.

Relational structure handled by Prisma and PostgreSQL.

---

## ⚖️ Trade-Off Analysis

| Decision                             | Trade-Off                                                                 |
|--------------------------------------|--------------------------------------------------------------------------|
| ✅ Prisma ORM                         | Easy schema management, migrations, and queries.                         |
| ❌ Local file uploads with Multer     | Simpler to test locally, but not scalable like S3 or Cloudinary.        |
| ✅ Versioning model                   | Clean version tracking, can expand with diff history or rollbacks later.|
| ❌ No frontend included               | Headless API allows flexibility; front-end could be React/Next.js later.|
| ✅ Nested folders via self-join       | Enables full hierarchy and path resolution.                             |

---

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/BhagatKaveri/file-management-system.git
cd file-management-system

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```
DATABASE_URL="postgresql://postgres:Sairam@123@localhost:5433/filedb?schema=public"
JWT_SECRET="your_secret_key"
PORT=5000
```

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the server

```bash
npm run dev
```

API available at: [http://localhost:5000](http://localhost:5000)

---

## 📬 API Endpoints

### 🔐 Authentication

| Method | Endpoint     | Description         |
|--------|--------------|---------------------|
| POST   | `/register`  | Register new user   |
| POST   | `/login`     | User login & get JWT |

---

### 📁 Folder Management

| Method | Endpoint             | Description                             |
|--------|----------------------|-----------------------------------------|
| GET    | `/viewstore`         | Get all root-level folders              |
| GET    | `/viewstore/:id`     | Get subfolders & documents of folder    |
| POST   | `/folders`           | Create a new folder                     |
| PUT    | `/folders/:id`       | Update/rename folder                    |
| DELETE | `/folders/:id`       | Delete folder (only if empty)           |

---

### 📄 Document Management

| Method | Endpoint                  | Description                                  |
|--------|---------------------------|----------------------------------------------|
| GET    | `/documents/:id`          | Get document details & versions              |
| POST   | `/documents`              | Create new document with version 1.0         |
| PUT    | `/documents/:id`          | Update document title/content                |
| DELETE | `/documents/:id`          | Delete document and all versions             |
| POST   | `/documents/:id/version`  | Upload a new version (e.g., 1.1, 2.0, etc.)   |
| GET    | `/documents/:id/versions` | List all versions of a document              |

> 📁 `POST /documents` and `POST /documents/:id/version` accept `multipart/form-data`.

---

### 🔎 Filter & Stats

| Method | Endpoint          | Description                                     |
|--------|-------------------|-------------------------------------------------|
| GET    | `/filter`         | Filter documents with folder path              |
| GET    | `/total-documents`| Get total count of user's documents            |

---

## 📄 Swagger & Postman

- Swagger: [`swagger.yaml`](./swagger.yaml)
- Postman: [`file management system collection.postman_collection.json`](./file management system collection.postman_collection.json)

---


