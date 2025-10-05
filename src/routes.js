import { Router } from 'express';
import { upload } from './app.js';
import { db } from './db.js';
import { parseString } from '@fast-csv/parse';

const router = Router();

router.get('/', (_req, res) => res.render('index'));
router.get('/import', (_req, res) => res.render('import'));

router.get('/report', async (req, res) => {
  const year = parseInt(req.query.year, 10);
  let q = db('enrollments')
    .select('year','municipality_code','municipality_name')
    .sum({ total_enrollments: 'enrollments' })
    .groupBy('year','municipality_code','municipality_name')
    .orderBy('total_enrollments','desc');
  if (!Number.isNaN(year)) q = q.where({ year });

  const rows = await q;
  const top = rows.slice(0, 10);
  const chart_labels = top.map(r => r.municipality_name);
  const chart_values = top.map(r => Number(r.total_enrollments));
  const years = (await db('enrollments').distinct('year').orderBy('year')).map(r => r.year);

  res.render('report', { rows, chart_labels, chart_values, years, selected_year: Number.isNaN(year) ? null : year });
});

router.post('/api/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Arquivo CSV é obrigatório.' });
    const rows = [];
    await new Promise((resolve, reject) => {
      parseString(req.file.buffer.toString('utf-8'), { headers: true, trim: true })
        .on('error', reject).on('data', (r) => rows.push(r)).on('end', resolve);
    });

    const required = ['year','municipality_code','municipality_name','level','enrollments'];
    for (const c of required) if (!(c in (rows[0] || {}))) return res.status(400).json({ error: `Coluna ausente no CSV: ${c}` });

    const payload = rows.map(r => ({
      year: Number(r.year),
      municipality_code: Number(r.municipality_code),
      municipality_name: String(r.municipality_name),
      level: String(r.level || ''),
      enrollments: Number(r.enrollments)
    }));
    await db('enrollments').insert(payload);
    res.status(201).json({ inserted: payload.length });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.get('/api/years', async (_req, res) => {
  const rows = await db('enrollments').distinct('year').orderBy('year');
  res.json(rows.map(r => r.year));
});

router.get('/api/report', async (req, res) => {
  const year = parseInt(req.query.year, 10);
  let q = db('enrollments')
    .select('year','municipality_code','municipality_name')
    .sum({ total_enrollments: 'enrollments' })
    .groupBy('year','municipality_code','municipality_name')
    .orderBy('total_enrollments','desc');
  if (!Number.isNaN(year)) q = q.where({ year });

  const data = await q;
  res.json(data.map(r => ({
    year: r.year,
    municipality_code: r.municipality_code,
    municipality_name: r.municipality_name,
    total_enrollments: Number(r.total_enrollments)
  })));
});

export default router;
