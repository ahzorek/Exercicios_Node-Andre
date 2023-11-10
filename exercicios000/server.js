const http = require('http')

const porta = 3001

const servidor = http.createServer((req, res) => {

  console.log('servidor respondendo na porta::', porta)
  let docname, content

  if (req.url == "/") {
    docname = 'Olá Pessoal'
    content = 'Olá, bem vindo ao servidor básico em node'
  } else
    if (req.url === '/cadastro') {
      docname = 'Cadastro'
      content = `
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
      ${content}
    </body>
    </html>
  `
  res.end(templateHTML)


})

servidor.listen(porta)