const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const Knex = require('knex')
const port = 3000;

const register = require('./controllers/register')
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

  const db =   Knex({
      client: 'pg',
      connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: true,
    }
  });
        
  db.select('*').from('users').then(function(data){
      console.log(data)
  })


const app = express();


app.use(bodyParser.json())
app.use(cors())


app.get('/',(req,res) => {
  res.send('it is working');
})

app.post('/signin',(req,res) => {signin.handleSignin(req,res,db,bcrypt)})

app.post('/register',(req,res) => {register.handleRegister(req,res,db,bcrypt)})

app.get('/profile/:id',(req,res) => {profile.handleProfileGet(req,res,db)})

app.put('/image',(req,res) => {image.handleImage(req,res,db)})

app.post('/imageUrl',(req,res) => {image.handleApiCall(req,res)})



app.listen(process.env.PORT || port, () =>{
    console.log(`app is running on port ${process.env.PORT }`)
})