# Phonebook

Exercises 3.1–3.22: a Node/Express phonebook API backed by MongoDB, with the
Part 2 React frontend served by the backend in production.

## Setup

1. Install Node.js 22.12 or newer.
2. Copy `.env.example` to `.env` and replace the MongoDB Atlas URI with your
   own connection string. Never commit `.env` or database credentials.
3. Install dependencies and build the frontend:

   ```sh
   npm install
   npm run build:ui
   ```

4. Start the API:

   ```sh
   npm start
   ```

The app listens on `http://localhost:3001` by default. `PORT` can be set by the
hosting platform. The API is available at `/api/persons` and `/info`.

For development, run the backend and frontend in separate terminals:

```sh
npm run dev
npm run dev:ui
```

Vite proxies API requests to the backend on port 3001. `npm run dev` restarts
the backend when server files change.

## MongoDB command-line utility

Set `MONGODB_URI` in `.env`. To use the course's password argument format, keep
`<password>` as the password portion of the URI and pass the password as an
argument. The program can list entries or add one:

```sh
node mongo.js yourpassword
node mongo.js yourpassword "Anna Example" 040-1234556
```

Alternatively, put the complete URI in `.env`; in that case, the first
argument is still required but is not used to modify the URI.

## Checks

```sh
npm test
npm run lint
npm run build:ui
```

The production build is written to `dist/` and served by Express. The backend
is configured for a hosting platform through `PORT`, but it has not been
deployed: deployment requires the owner's hosting account and MongoDB Atlas
credentials. Do not log request bodies in production; the Morgan body token is
included for the course exercise and can expose personal phone numbers.

For Render, use `npm install && npm run build:ui` as the build command and
`npm start` as the start command. Set `MONGODB_URI` in the service's
environment variables; Render supplies `PORT`.
