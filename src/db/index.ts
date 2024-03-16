import mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'read_companion',
  password: "Business_007"
});

export default async function excuteQuery({ query, values }) {
  try {
    const [results, fields] = await connection.query(query, values)
    // await connection.end();
    return results;
  } catch (error) {
    return { error };
  }
}