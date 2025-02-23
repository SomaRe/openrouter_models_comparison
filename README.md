# OpenRouter Models Comparison

## Prisma SQLite Setup

1. Install dependencies:
```bash
npm install @prisma/client
npm install prisma --save-dev
```

2. Initialize Prisma:
```bash
npx prisma init
```

3. The database schema is already configured in `prisma/schema.prisma` with a simple Comment model.

4. Generate and migrate the database:
```bash
npx prisma migrate dev --name init
```

5. Generate Prisma Client:
```bash
npx prisma generate
```

6. Start the development server:
```bash
npm run dev
```

## API Endpoints

- POST `/api/comments` - Create a new comment
- GET `/api/comments/[id]` - Get a comment by ID

The database uses SQLite with a simple schema:
```prisma
model Comment {
  id       String @id @default(cuid())
  comments String
}
```
