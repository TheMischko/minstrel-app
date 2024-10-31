/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("music", (table) => {
    table.increments("id").primary();
    table.string("title", 64).unique().notNullable();
    table.string("filePath").unique().notNullable();
    table.datetime("dateCreated").defaultTo(knex.fn.now());
    table.datetime("dateLastUpdated").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema.dropTableIfExists("music");
};
