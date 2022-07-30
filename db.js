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

let getRelatedProducts = (current_product_id) => {
  return db.queryAsync(`SELECT related_product_id FROM related
    where current_product_id = ${current_product_id}`)
    .then(results => {return results[0]})
    .catch(err => console.log(err))
}

let getProductsListDefaultPage = (count) => {
  return db.queryAsync(`Select * from products order by id asc limit ${count}`)
  .then(result => result[0])
  .catch(err => console.log(err))
}

let getProductsListCustomPage = (count, page) => {
  return db.queryAsync(`Select * from products where id > ${(page - 1)*count} order by id asc limit ${count}`)
  .then(result => result[0])
  .catch(err => console.log(err))
}

module.exports = {db, getRelatedProducts, getProductsListCustomPage, getProductsListDefaultPage};