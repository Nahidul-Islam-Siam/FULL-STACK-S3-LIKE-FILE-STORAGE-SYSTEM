# Full Stack S3-Like File Storage System

A local object-storage app with secure uploads, public URLs, a Next.js dashboard, Prisma metadata, and a storage service boundary that can later be swapped for AWS S3 without changing routes, controllers, or frontend calls.

## Stack

- Backend: Node.js, Express, TypeScript, Prisma, SQLite, Multer, dotenv, CORS
- Frontend: Next.js, TypeScript, Redux Toolkit, React Redux
- Storage: local disk under `backend/uploads`

## Features

- Upload images, videos, PDFs, Word, and Excel files
- Public file URLs served from `/uploads`
- Type-specific validation for extension, MIME type, and size
- Blocks `.exe`, `.sh`, and `.bat`
- Sanitized stored filenames and path traversal protection
- File gallery with image and video previews
- Copy public URL and delete files from the dashboard
- S3-ready storage abstraction in `backend/src/services/storage.service.ts`

## API

```txt
GET    /api/v1/files
POST   /api/v1/files/upload
DELETE /api/v1/files/:type/:filename
GET    /uploads/:type/:filename
```

Upload form field:

```txt
file
```

## Validation Rules

| Category | Extensions | MIME Types | Limit |
| --- | --- | --- | --- |
| Images | `jpg`, `jpeg`, `png`, `webp` | `image/jpeg`, `image/png`, `image/webp` | 5 MB |
| Videos | `mp4`, `mov`, `avi` | `video/mp4`, `video/quicktime`, `video/x-msvideo` | 50 MB |
| Documents | `pdf`, `doc`, `docx`, `xls`, `xlsx` | common Office/PDF MIME types | 10 MB |

## Environment

Backend `backend/.env`:

```env
PORT=5000
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
```

Frontend `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

For deployment, set `BASE_URL` to your deployed backend domain, for example:

```env
BASE_URL=https://your-domain.com
```

## Run Locally

Install dependencies:

```bash
npm run install:all
```

Create the SQLite database and Prisma client:

```bash
npm run db:migrate
```

Start the backend:

```bash
npm run dev:backend
```

Start the frontend in another terminal:

```bash
npm run dev:frontend
```

Open:

```txt
http://localhost:3000
```

## S3 Migration Path

The controller and routes only depend on:

```ts
uploadFile(file)
deleteFile(fileKey)
getFileUrl(fileKey)
```

To migrate to AWS S3 later, replace the implementation inside `backend/src/services/storage.service.ts` while preserving those function signatures and returned `fileKey`/`url` values.
