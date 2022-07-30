const {Client} = require('pg');
const Promise = require("bluebird");

const connection = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.PORT
})

const db = Promise.promisifyAll(connection, { multiArgs: true });

db.connectAsync()
  .then(() => console.log(`Connected to PostGres at port: ${process.env.PORT}`))
  .catch((err) => console.log(`DB Connection ERROR`, err))

module.exports = db