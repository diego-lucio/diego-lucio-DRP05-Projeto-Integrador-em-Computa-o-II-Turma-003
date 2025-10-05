import 'dotenv/config';
import { app } from './app.js';
import { exec as _exec } from 'child_process';

const PORT = process.env.PORT || 3000;
async function ensureMigrations() {
  if ((process.env.NODE_ENV || 'development') !== 'production') {
    await new Promise((resolve, reject) => {
      _exec('npx knex migrate:latest', (err) => err ? reject(err) : resolve());
    });
  }
}
ensureMigrations().then(() => {
  app.listen(PORT, () => console.log(`http://127.0.0.1:${PORT}`));
}).catch((e) => { console.error(e); process.exit(1); });
