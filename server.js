const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const Knex = require('knex')

const register = require('./controllers/register')
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

  const db =   Knex({
      client: 'pg',
      connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'godwin',
      database : 'smartbrain'
    }
  });
        
  db.select('*').from('users').then(function(data){
      console.log(data)
  })


const app = express();


app.use(bodyParser.json())
app.use(cors())


app.get('/',(req,res) => {
    res.send('database.users');
})

app.post('/signin',(req,res) => {signin.handleSignin(req,res,db,bcrypt)})

app.post('/register',(req,res) => {register.handleRegister(req,res,db,bcrypt)})

app.get('/profile/:id',(req,res) => {profile.handleProfileGet(req,res,db)})

app.put('/image',(req,res) => {image.handleImage(req,res,db)})

app.post('/imageUrl',(req,res) => {image.handleApiCall(req,res)})



app.listen(3000, () =>{
    console.log("app is running on port 3000")
})