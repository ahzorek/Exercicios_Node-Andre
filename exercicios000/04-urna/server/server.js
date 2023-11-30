import express from 'express'
import cors from 'cors'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 4321

const __dirname = path.dirname(new URL(import.meta.url).pathname)

app.use(express.json())
app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "View")))


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/view/index.html"))
})

app.get("/first_load", async (req, res) => {
  // console.log(req.query.elec_code)
  try {
    const data = await readFile(
      `urna_config/config_${req.query.elec_code}.csv`,
      'utf-8'
    )

    const options = parseCSVData(data)

    res.status(200).json(options)

  } catch (error) {
    console.error('Erro ao ler o arquivo:', error)
    res.status(500).json({ error: 'Erro ao ler o arquivo.' })
  }
})

app.post("/create_config", async (req, res) => {
  try {
    const { elec_code, options } = req.body

    const csvContent = options.map(option => {
      return `${option.voteIsAnon ? 'a' : 'b'},${option.num},${option.name},${option.pic}`
    }).join("\n")

    await writeFile(
      `urna_config/config_${elec_code}.csv`,
      csvContent,
      'utf-8'
    )

    res.status(201).json({ status: 'success', message: 'Arquivo CSV criado com sucesso.' })

  } catch (error) {
    console.error('Erro ao criar o arquivo:', error)
    res.status(500).json({ error: 'Erro ao criar o arquivo.' })
  }
})

app.post("/register_vote", async (req, res) => {
  try {
    const { elec_code } = req.body

    console.log(elec_code)

    await writeFile(
      `db/poll_results/results_${elec_code}.csv`,
      'voto\n',
      {
        encoding: 'utf-8',
        flag: 'a'
      })

    res.status(201).json({ status: 'success', message: 'Arquivo CSV atualizado com sucesso.' })
  } catch (error) {
    console.error('Erro ao criar o arquivo:', error)
    res.status(500).json({ error })
  }
})

app.listen(PORT, () => {
  console.log('Ouvindo em', PORT)
})

function parseCSVData(data) {
  const options = []

  data.split("\n").forEach(option => {
    const [tipoEleicao, numeroCandidato, nomeCandidato, urlFoto] = option.split(",")

    options.push({
      tipoEleicao,
      numeroCandidato: parseInt(numeroCandidato),
      nomeCandidato,
      urlFoto
    })
  })

  return options
}