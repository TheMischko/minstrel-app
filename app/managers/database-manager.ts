import { Knex, knex } from 'knex';
import config from '../../knexfile';
import { Tables } from '../models/database-data-model';

export class DatabaseManager {
  database: Knex;

  constructor() {
    const mode =
      process.env.NODE_ENV === 'production' ? 'production' : 'development';
    this.database = knex(config[mode]);
  }

  /**
   * Gets all records from set table.
   * @param table Name of the table.
   */
  findAll<T>(table: Tables): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.database(table)
        .then((result) => {
          resolve(result as T[]);
        })
        .catch((err) => reject(err));
    });
  }

  /**
   * Finds a record matching ID in set table and returns it.
   * @param table Name of the table.
   * @param id Identifier of the record.
   */
  findById<T>(table: Tables, id: number): Promise<T> {
    return new Promise((resolve, reject) => {
      this.database(table)
        .where({ id: Number(id) })
        .then((result) => resolve(result[0] as T))
        .catch((err) => reject(err));
    });
  }

  /**
   * Finds all occurrences matching criteria in set table.
   * @param table Name of the table.
   * @param criteria Criteria of the search.
   */
  findBy<T>(table: Tables, criteria: knex.Knex.Where): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.database(table)
        .where(criteria)
        .then((result) => resolve(result as T[]))
        .catch((err) => reject(err));
    });
  }

  /**
   * Creates a new record from provided data in set table. Returns new record.
   * @param table Name of the table.
   * @param data Data of the new record.
   */
  insert<T>(table: Tables, data: Partial<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.database(table)
        .insert(data, ['id'])
        .then(async (ids) => {
          if (ids.length === 0) {
            reject(
              `Insert in table ${table} with data:\n ${JSON.stringify(
                data,
                () => {},
                4,
              )} \nresulted in no IDs.`,
            );
          }
          const newRecord = this.findById<T>(table, ids[0]);
          resolve(newRecord);
        })
        .catch((err) => reject(err));
    });
  }

  /**
   * Updated values of a record matched with ID in set database table. Returns number of updated rows.
   * @param table Name of the table.
   * @param id Identifier of record.
   * @param data Object containing record overrides.
   */
  update<T>(table: Tables, id: number, data: Partial<T>): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.database(table)
        .where({ id: Number(id) })
        .update(data)
        .then((numUpdated) => resolve(numUpdated))
        .catch((err) => reject(err));
    });
  }

  /**
   * Removes a record in set database table. Returns number of removed rows.
   * @param table Name of the table.
   * @param criteria Object of column filter values.
   */
  remove(table: Tables, criteria: knex.Knex.Where): Promise<number> {
    return new Promise((resolve, reject) => {
      this.database(table)
        .where(criteria)
        .del()
        .then((numRemoved) => resolve(numRemoved))
        .catch((err) => reject(err));
    });
  }

  /**
   * Removes a record matched by ID in set database table. Returns number of removed rows.
   * @param table Name of the table
   * @param id Identifier of removed record
   */
  removeById(table: Tables, id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.database(table)
        .where({ id: Number(id) })
        .del()
        .then((numRemoved) => resolve(numRemoved))
        .catch((err) => reject(err));
    });
  }
}
