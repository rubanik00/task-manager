import pgPromise from "pg-promise";

const pgp = pgPromise();

// Конфигурация подключения к базе данных
const connectionConfig = {
  host: "localhost", // Замените на адрес вашей PostgreSQL базы данных
  port: 5433, // Замените на порт вашей PostgreSQL базы данных
  database: "postgres",
  user: "postgres",
  password: "2505",
};

// Создаем объект базы данных
const db = pgp(connectionConfig);

// SQL-запросы для создания таблиц
const createTablesQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    assign_to_user INT REFERENCES users(id),
    status VARCHAR(50) NOT NULL,
    creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

async function createDatabaseAndTables() {
  try {
    await db.none(`CREATE DATABASE task_manager`);
    console.log('Database "task_manager" created.');

    const newConnectionConfig = {
      ...connectionConfig,
      database: "task_manager",
    };
    const newDB = pgp(newConnectionConfig);

    await newDB.none(createTablesQuery);
    console.log(
      'Tables "users" and "tasks" created in "task_manager" database.'
    );
  } catch (error) {
    console.error("Error while creating database:", error);
  } finally {
    pgp.end();
  }
}

createDatabaseAndTables();
