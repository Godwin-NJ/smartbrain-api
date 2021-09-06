const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const Knex = require('knex')

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

// const database = {
//     users : [
//         {
//         id : '123',
//         name : 'john',
//         email: 'john@gmail.com',
//         password: 'cookies',
//         entries : 0,
//         join: new Date()
//     },
//     {
//         id : '124',
//         name : 'sally',
//         email: 'sally@gmail.com',
//         password: 'bananas',
//         entries : 0,
//         join: new Date()
//     }
// ],

//     login : [
//         {
//             id:'987',
//             hash:'',
//             email:'john@gmail.com'
//         }
//     ]
// }


app.get('/',(req,res) => {
    res.send(database.users);
})

app.post('/signin',(req,res) =>{

    db.select('email','hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
           const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
           console.log(isValid)
           if(isValid){
             return db.select('*').from('users')
               .where('email', '=', req.body.email)
               .then(user => {
                   console.log(user)
                   res.json(user[0])
               })
               .catch(err => res.status(400).json('unable to get user'))
           }else{
               res.status(400).json('wrong credentials')
           }
        })
        .catch(err => res.status(400).json('wrong credentials'))


    // if(req.body.email === database.users[0].email && req.body.password 
    //     === database.users[0].password){
    //         res.json('success')
    //     }else {
    //         res.status(400).json("error loging in");
    //     }
    // Load hash from your password DB.
    // bcrypt.compare("cookies", '$2a$10$MXcDYjuR.wGJxcmNvoEinOJZ.0NFCdz6pTRPi59Zec1lMK12YHwQ2', function(err, res) {
    //     console.log('first guess', res)
    // });
    // bcrypt.compare("veggies", "$2a$10$MXcDYjuR.wGJxcmNvoEinOJZ.0NFCdz6pTRPi59Zec1lMK12YHwQ2", function(err, res) {
    //     console.log('second guess', res)
    // });
})

app.post('/register',(req,res) => {
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction((trx) =>{
        trx.insert({
            hash:hash,
            email: email
            })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
                name:name,
                email:loginEmail[0],
                joined: new Date()
            })
            .then(user => {
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
        .catch(err => {
            res.status(400).json('user already exist')
        })

    // res.json(database.users[database.users.length-1]);
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     console.log(hash);
    // });
    // database.users.push({
    //     id : '125',
    //     name : name,
    //     email: email,
    //     entries : 0,
    //     join: new Date()
    // })
})


app.get('/profile/:id',(req,res) => {
    const{ id } = req.params;
    // let found = false;
    db.select('*').from('users')
    .where({id})
    .then(user => {
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json('does not exist')
        }
        
    })
    .catch(err => res.status(400).json('error getting user'))
    // if(!found){
    //     res.status(400).json('no more error');
    // }
    // database.users.forEach(user => {
    //     if(user.id === id){  
    //         found = true;
    //      return res.json(user);
    //     }
    // })
})

app.put('/image',(req,res) => {
    const{ id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries)
    })
    .catch(err => res.status(400).json('unable to get entries'))
    // let found = false;
    // database.users.forEach(user => {
    //     if(user.id === id){
    //         found = true;
    //         user.entries++
    //      return res.json(user.entries);
    //     }
    // })
    // if(!found){
    //     res.status(400).json('no more error');
    // }
})



app.listen(3000, () =>{
    console.log("app is running on port 3000")
})