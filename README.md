# Aura Notes

A simple notes application with email/password authentication.

## Structure

- **notes-backend** — Express + MongoDB (Mongoose) API with signup/login.
- **notes-frontend** — Next.js app with login, signup, and dashboard pages.

## Getting started

### Backend

```bash
cd notes-backend
npm install
cp .env.example .env   # then fill in your MongoDB connection string
npm run dev
```

### Frontend

```bash
cd notes-frontend
npm install
cp .env.example .env.local
npm run dev
```
