const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg')
var pool;
pool = new Pool({
  connectionString: process.env.DATABASE_URL
})
express()
  .use(express.json())
  .use(express.urlencoded({extended:false}))
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

  .get('/', (req, res) => res.render('pages/index'))
  .get('/database', (req,res) => {
    var getUserQuery = 'SELECT * FROM users'
    pool.query(getUserQuery, (error, result) => {
      if (error) {
        console.log(error);
      }
      var results = {'rows':result.rows}
      res.render('pages/db',results)
    })
  })
  .get('/adduser', (req, res) => res.render('pages/adduser'))
  .get('/user/:id', (req, res) =>{
    var id = req.params.id
    var getUserQuery = `SELECT * FROM users WHERE id = ${id}`
    pool.query(getUserQuery , (error,result) =>{
      if (error) {
        console.log(error);
      }
      var results = {'rows':result.rows}
      res.render('pages/user',results)
    })
  })
  .post('/adduser', (req, res) => {
    var name = req.body.name
    var width = req.body.width
    var height = req.body.height
    var type = req.body.type
    var addUserQuery = {
      text: `INSERT INTO users (name,width,height,type) VALUES ($1,$2,$3,$4)`,
      values: [name, width, height, type]
    }
    pool.query(addUserQuery, (error,result) => {
      if (error) {
        console.log(error);
      }
    })
    res.redirect('/adduser')
  })
  .post('/edituser', (req, res) => {
    var id = req.body.id
    var name = req.body.name
    var width = req.body.width
    var height = req.body.height
    var type = req.body.type
    var editUserQuery = {
      text: `UPDATE users SET name=$1, width=$2, height=$3, type=$4 WHERE id=$5`,
      values: [name, width, height, type, id]
    }
    pool.query(editUserQuery, (error,result) => {
      if (error) {
        console.log(error);
      }
    })
    res.redirect(`/user/${id}`)
  })
  .post('/deluser', (req, res) => {
    var id = req.body.id
    var delUserQuery = {
      text: `DELETE FROM users WHERE id=$1`,
      values: [id]
    }
    pool.query(delUserQuery, (error,result) => {
      if (error) {
        console.log(error);
      }
    })
    res.redirect('/database')
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
