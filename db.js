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
  return db.queryAsync(`SELECT json_agg(related_product_id) FROM related
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

let getProductInfo = (product_id) => {
  return db.queryAsync(
    `select json_build_object('id', id,
                             'name', name,
                             'slogan', slogan,
                             'description', description,
                             'category', category,
                             'default_price', default_price,
                             'features', featuresarray
                             ) productsobj
                             from products
                             left join
                             (select product_id,
                              json_agg(json_build_object( 'feature', feature, 'value', value)) featuresarray
                              from features as f group by product_id)
                              f on id = f.product_id
                              where product_id = ${product_id}`)
   .then(result => result[0])
   .catch(err => console.log(err))
}


module.exports = {db, getRelatedProducts, getProductInfo, getProductsListCustomPage, getProductsListDefaultPage};