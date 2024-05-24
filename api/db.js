import pg from "pg";

const pool = new pg.Pool({
  user: "postgres",
  password: "31242",
  host: "localhost",
  port: 5432,
  database: "auth_jwt",
});

export default pool;
