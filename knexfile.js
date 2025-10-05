export default {
  development: { client: 'sqlite3', connection: { filename: './data/dev.sqlite3' }, useNullAsDefault: true, migrations: { directory: './migrations' } },
  test:        { client: 'sqlite3', connection: { filename: ':memory:' },           useNullAsDefault: true, migrations: { directory: './migrations' } },
  production:  { client: 'pg',      connection: process.env.DATABASE_URL,           migrations: { directory: './migrations' } }
};
