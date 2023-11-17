const express = require("express") //O módulo express retorna uma função que instancia o express
const conversorJson = require("body-parser")
const cors = require("cors")
const app = express() //A função express cria uma instância de todo o framework express em app

app.use(conversorJson.urlencoded({ extended: false })) //middleware
app.use(conversorJson.json())

app.use(function (req, resp, next) {
  resp.header("Access-Control-Allow-Origin", "*")
  //resp.header("Access-Control-Allow-Origin", "http://localhost:8080")

  app.use(cors())
  next()
})


app.post("/cadastro", function (req, res) {
  const { body } = req

  res.json({ 'O OBJETO RECEBIDO NO SERVIDOR FOI': body })
})


//Cria o Servidor com o express
const porta = 3001
app.listen(porta, function () {
  console.log(`Servidor Rodando na porta ${porta}`)
})
