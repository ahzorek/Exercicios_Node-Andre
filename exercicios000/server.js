const http = require('http')

const porta = 3001

const servidor = http.createServer((req, res) => {
  console.log('servidor respondendo na porta::', porta)

  let docname, message
  if (req.url == "/") {
    docname = 'Olá Pessoal'
    message = 'Olá, bem vindo ao servidor básico em node'
  } else
    if (req.url === '/cadastro') {
      docname = 'Cadastro'
      message = `
        <form>
          <input type="text" name="nome" id="nome" placeholder="seu nome">
          <input type="number" name="idade" id="idade" placeholder="sua idade">
        </form>
      `
    }

  const templateHTML = `
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>${docname}</title>
    </head>
    <body>
      <h1>${message}</h1>
    </body>
    </html>
  `
  res.end(templateHTML)


})

servidor.listen(porta)