# Tune Fox

Tune Fox is a full stack music streaming web application built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, JWT authentication, and Cloudinary uploads.

## Features

- Register, login, logout, and JWT protected routes
- First registered user automatically becomes admin
- Upload songs and thumbnails to Cloudinary
- Persistent bottom music player with play, pause, next, previous, seek, volume, repeat, and shuffle
- Search songs by title, artist, or album
- Create playlists and add/remove songs
- Like/favorite songs
- Recently played history
- Admin dashboard for stats, users, and songs
- Responsive dark Spotify-like UI

## Project Structure

```txt
Music App/
|-- client/
|   |-- src/
|   |-- components/
|   |-- pages/
|   |-- context/
|   |-- services/
|   `-- assets/
|-- server/
|   |-- controllers/
|   |-- routes/
|   |-- models/
|   |-- middleware/
|   |-- config/
|   `-- uploads/
`-- README.md
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB Atlas account
- Cloudinary account

## Install

From inside the `Music App` folder:

```bash
npm install
```

The project uses npm workspaces, so one install command installs the frontend, backend, and root dev dependency.

## Environment Setup

Create local env files:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Windows PowerShell:

```powershell
Copy-Item client/.env.example client/.env
Copy-Item server/.env.example server/.env
```

### client/.env

```env
VITE_API_URL=http://localhost:5000/api
```

### server/.env

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tunefox
JWT_SECRET=replace_with_a_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## MongoDB Atlas Setup

1. Create a free cluster at https://www.mongodb.com/cloud/atlas.
2. Create a database user and password.
3. In Network Access, allow your current IP address.
4. Click Connect, choose Drivers, and copy the connection string.
5. Replace `MONGODB_URI` in `server/.env`.
6. Use `tunefox` as the database name in the URI.

Example:

```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/tunefox
```

## Cloudinary Setup

1. Create an account at https://cloudinary.com.
2. Open the Cloudinary dashboard.
3. Copy Cloud name, API key, and API secret.
4. Put those values in `server/.env`.

Tune Fox stores audio in `tune-fox/audio` and thumbnails in `tune-fox/thumbnails`.

## Run Locally

From inside `Music App`:

```bash
npm run dev
```

This starts both apps:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

Register the first account to create the admin user.

## Useful Commands

```bash
npm run dev
npm run build
npm run start
npm run dev --workspace client
npm run dev --workspace server
```

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Songs

- `GET /api/songs`
- `GET /api/songs?search=query`
- `POST /api/songs`
- `POST /api/songs/:id/play`
- `DELETE /api/songs/:id`

### Playlists

- `GET /api/playlists`
- `POST /api/playlists`
- `PUT /api/playlists/:id`
- `DELETE /api/playlists/:id`
- `POST /api/playlists/:id/songs`
- `DELETE /api/playlists/:id/songs/:songId`

### Favorites

- `GET /api/favorites`
- `POST /api/favorites/:songId`

### Users/Admin

- `GET /api/users/profile`
- `GET /api/users/stats`
- `GET /api/users`
- `DELETE /api/users/:id`

## Deploy Frontend to Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Set Root Directory to `client`.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add this environment variable:

```env
VITE_API_URL=https://your-render-api-url.onrender.com/api
```

7. Deploy.

## Deploy Backend to Render

1. Push the project to GitHub.
2. Create a new Render Web Service.
3. Set Root Directory to `server`.
4. Build Command: `npm install`.
5. Start Command: `npm start`.
6. Add these environment variables in Render:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

7. Deploy the backend and update Vercel `VITE_API_URL` with the deployed Render URL plus `/api`.

## Notes

- Uploaded files are stored in Cloudinary, not in the local filesystem.
- Do not commit real `.env` files.
- The first registered account is admin, so create your own account first.
