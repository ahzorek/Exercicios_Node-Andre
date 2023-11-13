const express = require('express')
const app = express()

const porta = 3001

app.get('/', (req, res) => {
  console.log('Servidor respondendo na porta:', porta)
  const docname = 'Olá Pessoal';
  const content = 'Olá, bem-vindo ao servidor básico em node, agora usando express'

  const templateHTML = `
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>${docname}</title>
    </head>
    <body>
    <h1>Servidor Node</h1>
      ${content}
    </body>
    </html>
  `
  res.send(templateHTML)
})

app.get('/cadastro', (req, res) => {
  console.log('Servidor respondendo na porta:', porta)
  const docname = 'Cadastro'
  const content = `
    <form>
      <input type="text" name="nome" id="nome" placeholder="seu nome">
      <input type="number" name="idade" id="idade" placeholder="sua idade">
    </form>
  `

  const templateHTML = `
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>${docname}</title>
    </head>
    <body>
    <h1>Servidor Node</h1>
      ${content}
    </body>
    </html>
  `;
  res.send(templateHTML);
})

app.listen(porta, () => {
  console.log(`Servidor escutando na porta ${porta}`)
})
