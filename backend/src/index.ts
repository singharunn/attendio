import cors from 'cors';
import express from 'express';
import { createDemoData } from './data/store.js';
import { env } from './config/env.js';
import authRoutes from './routes/auth.js';
import subjectRoutes from './routes/subjects.js';
import dashboardRoutes from './routes/dashboard.js';

createDemoData();

const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'attendio-backend' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/subjects', subjectRoutes);
app.use('/api/v1/users', dashboardRoutes);
app.use('/api/v1/calculations', dashboardRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(env.port, () => {
  console.log(`Attendio backend listening on http://localhost:${env.port}`);
});

export default app;
