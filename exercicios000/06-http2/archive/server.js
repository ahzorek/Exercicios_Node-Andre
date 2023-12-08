import https from 'https'
import fs from 'fs'
import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.status(200).send('success')
})

const server = https.createServer({
  key: fs.readFileSync('key.pem', 'utf-8'),
  cert: fs.readFileSync('cert.pem', 'utf-8')


}, app)


const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`servidor ouvindo na em https://localhost:${PORT}`)
})