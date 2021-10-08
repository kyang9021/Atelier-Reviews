const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  max: process.env.PGMAX,
  idleTimeoutMillis: process.env.PGIDLETIMEOUTMILLIS
});

pool.connect()
    .then(() => console.log(`Connected to PostgreSQL Database with Pool!`))
    .catch((err) => console.log(err));

module.exports = pool;