import express from 'express'
import cors from 'cors'
import path from 'path'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import { readFile, writeFile } from 'fs/promises'
import { auth, apuracao, cargaInicial, registerVote, createConfig } from './routes/index.js'
import 'dotenv/config'

const PORT = process.env.PORT || 4321
const SECRET = process.env.SECRET || 'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2'

const TTE = 60 * 60 * 2 // 2hours
const blacklist = []
const __dirname = path.dirname(new URL(import.meta.url).pathname)

export const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "view")))

app.get("/", verifyAuthToken, (req, res) => {
  res.sendFile(path.join(__dirname, "/view/polling_booth.html"))
})

app.post("/auth", auth)

app.get("/apuracao", apuracao)

app.get("/first_load", cargaInicial)

app.post("/create_config", createConfig)

app.post("/register_vote", registerVote)

app.get('/logout', (req, res) => {
  blacklist.push(req.cookies.token)
  console.log('BLACKLISTED TOKENS', blacklist)
  res.clearCookie('token')
  res.redirect('/login')

})

app.get("/login", (req, res, ctx) => {
  res.status(200).sendFile(path.join(__dirname, "/view/login.html"))
})

app.get("/test-token", verifyAuthToken, (req, res) => {
  res.status(301).redirect('/')
})

app.listen(PORT, () => {
  console.log('Ouvindo em', PORT)
})

function verifyAuthToken(req, res, next) {
  const token = req.cookies.token
  console.log('VERIFY AUTH TOKEN CALL', token)

  // const indexTokenBlack = blacklist.findIndex(tokenLista => tokenLista == token)
  // if (indexTokenBlack > -1) res.status(301).redirect('/login')

  jwt.verify(token, SECRET, (error, decoded) => {
    if (error) {
      res.status(301).redirect('/login')
    }
    else if (decoded) {
      next()
    }

  })

}