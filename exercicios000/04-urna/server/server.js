import express from 'express'
import cors from 'cors'
import { readFile, writeFile } from 'fs/promises'

const app = express()
const PORT = 4321

app.use(express.json())
app.use(cors())

app.get("/first_load", async (req, res) => {
  try {
    const data = await readFile(
      `assets/urna_config/config_${req.query.elec_code}.csv`,
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
      `assets/urna_config/config_${elec_code}.csv`,
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
    const [voteType, num, name, pic] = option.split(",")

    options.push({
      voteIsAnon: voteType === 'a' ? true : false,
      num: parseInt(num),
      name,
      pic
    })
  })

  return options
}