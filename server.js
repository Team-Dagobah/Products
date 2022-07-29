require("dotenv").config();
const express = require("express");

const db = require('./db.js')

const app = express();

app.use(express.json())

db.connect();

app.listen(3000, ()=> console.log("Listening at port 3000"))

app.get('/products', (req, res) => {
  let page = req.query.page || 1
  let count = req.query.count || 5
  if(page === 1){
    db.query(`Select * from products order by id asc limit ${count}`, (err, result) =>{
      if(!err) {
        res.status(200).send(result.rows)
      }
    });
  } else {
    db.query(`Select * from products where id > ${(page - 1)*count} order by id asc limit ${count}`, (err, result) =>{
      if(!err) {
        res.status(200).send(result.rows)
      }
    });
  }
  // db.end;
})