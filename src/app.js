import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes.js';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export const upload = multer({ storage: multer.memoryStorage() });
app.use('/', routes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
