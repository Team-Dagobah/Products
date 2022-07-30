require("dotenv").config();
const express = require("express");

const db = require('./db.js')

const app = express();

app.use(express.json())

app.listen(3000, ()=> console.log("Listening at port 3000"))

// app.get('/products', (req, res) => {
//   let page = req.query.page || 1
//   let count = req.query.count || 5
//   if(page === 1){
//     db.query(`Select * from products order by id asc limit ${count}`, (err, result) =>{
//       if(!err) {
//         res.status(200).send(result.rows)
//       } else{
//         console.log(err)
//       }
//     });
//   } else {
//     db.query(`Select * from products where id > ${(page - 1)*count} order by id asc limit ${count}`, (err, result) =>{
//       if(!err) {
//         res.status(200).send(result.rows)
//       }else{
//         console.log(err)
//       }
//     });
//   }
// })
app.get('/products', (req, res) => {
  let page = req.query.page || 1
  let count = req.query.count || 5
  if(page === 1){
    db.getProductsListDefaultPage(count)
    .then((result) => {
      res.status(200).send(result.rows)
    })
    .catch((err) => console.log(err))
  } else {
    db.getProductsListCustomPage(count, page)
    .then((result) => {
      res.status(200).send(result.rows)
    })
    .catch((err) => console.log(err))
  }
})


app.get(`/products/:product_id`, (req, res) =>{
  db.getRelatedProducts(req.params.product_id)
  .then((result) => {
    res.status(200).send(result.rows[0].json_agg)
  })
  .catch(err => console.log(err))
})

//add EXPLAIN ANALYZE in front of query to see