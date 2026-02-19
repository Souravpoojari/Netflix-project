Deployment guide — Frontend (Vercel) + Backend (Render / Railway / Docker)

1) Frontend (Vercel)

- In the Vercel dashboard, import this repository and choose the `netflix-clone` folder as the project root.
- Build command: `npm run build`
- Output directory: `build`
- Add Environment Variable: `REACT_APP_API_URL` = `https://<your-backend-url>`

2) Backend (recommended: Render / Railway / Heroku / Docker)

- Create a managed MySQL database (PlanetScale, RDS, ClearDB, etc.). Run `netflix-backend/sql/init.sql` to create `netflix_auth` and `users` table.
- Deploy the `netflix-backend` folder as a service. Use the `Dockerfile` included or the Node environment.
- Set environment variables in the service's settings: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `FRONTEND_URL`.

3) Local testing

- Set `.env` values in `netflix-backend` (copy `.env.example`).
- Start backend: `npm run dev` (or `npm start`)
- Start frontend: in `netflix-clone` run `npm start` and ensure `REACT_APP_API_URL` points to your backend.
