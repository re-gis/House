const express = require('express')
const router = require('./routes/clientRoute')
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT
const bodyParser = require('body-parser')
const connectDB = require('./config/db')
const sessions = require('express-session')
const cookieParser = require('cookie-parser')
const { role } = require('./middlewares/adminMiddleware')

// Using sessions
const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: process.env.SECRET,
    saveUninitialized: true,
    cookie: {maxAge: oneDay },
    resave: false
}))

// Cookie parser stuff
app.use(cookieParser())

// Database stuff
connectDB()

// Body parser stuff
app.use(bodyParser.urlencoded({ extended: false }))

// APIs
app.use('/', router)

app.get('/one', role, (req, res) => {
    res.send('Hy')
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
})