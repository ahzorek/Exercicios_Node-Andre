import fs from 'fs'
import express from 'express'
import spdy from 'spdy'

const PORT = process.env.PORT || 3001
const HTTPPORT = process.env.HTTPPORT || 3002

const app = express()

app.get('/', (req, res) => {
  res.status(200).send('success')
})

const server = spdy.createServer({
  key: fs.readFileSync('key.pem', 'utf-8'),
  cert: fs.readFileSync('cert.pem', 'utf-8')
}, app)

app.listen(HTTPPORT, () => {
  console.log(`servidor ouvindo em http://localhost:${HTTPPORT}`)
})

server.listen(PORT, () => {
  console.log(`servidor ouvindo em https://localhost:${PORT}`)
})