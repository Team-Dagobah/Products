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

let getProductStyles = (product_id) => {
  return db.queryAsync(`SELECT
  products.id AS product_id,
  ( SELECT json_agg(result)
    FROM ( SELECT
        styles.id AS style_id,
        styles.name,
        styles.original_price,
        styles.sale_price,
        Cast(styles.default_style as boolean) as "default?",
        ( SELECT json_agg(item)
          FROM ( SELECT
            photos.thumbnail_url,
            photos.url
            FROM photos
            WHERE photos.style_id = styles.id
              ) item
            ) AS photos,
        (SELECT json_object_agg(
              skus.id, json_build_object('quantity', skus.quantity, 'size', skus.size))
          FROM skus
          WHERE skus.style_id = styles.id
          ) AS skus
          FROM styles
          WHERE styles.product_id = products.id
      ) result
    ) AS results
  FROM products
  WHERE products.id = ${product_id}`)
  .then(result => result[0])
  .catch(err => console.log(err))
}


module.exports = {db, getRelatedProducts, getProductStyles, getProductInfo, getProductsListCustomPage, getProductsListDefaultPage};