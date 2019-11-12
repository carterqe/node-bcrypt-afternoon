require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
app.use(express.json())
const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env
const massive = require('massive')
const session = require('express-session')
const auth = require('./middleware/authMiddleware');

massive(CONNECTION_STRING).then(db => {
  app.set('db', db)
  console.log('connected')
  app.listen(SERVER_PORT, () => console.log(`Listening on server port${SERVER_PORT}.`))
})

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
  })
)

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)