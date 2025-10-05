export async function up(knex) {
  const exists = await knex.schema.hasTable('enrollments');
  if (!exists) {
    await knex.schema.createTable('enrollments', (t) => {
      t.increments('id').primary();
      t.integer('year').notNullable().index();
      t.integer('municipality_code').notNullable().index();
      t.string('municipality_name', 150).notNullable().index();
      t.string('level', 80).notNullable().defaultTo('');
      t.integer('enrollments').notNullable().defaultTo(0);
      t.timestamps(true, true);
    });
  }
}
export async function down(knex) { await knex.schema.dropTableIfExists('enrollments'); }
