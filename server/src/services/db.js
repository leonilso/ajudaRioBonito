import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// db.connect((err) => {
//   if (err) console.error("Erro ao conectar ao banco:", err);
//   else console.log("Conectado ao MySQL!");
// });

export default db;
