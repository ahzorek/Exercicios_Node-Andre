import { readFile } from 'fs/promises'

const cargaInicial = async (req, res) => {
  try {
    const data = await readFile(`db/poll_config/config_${req.query.elec_code}.csv`, 'utf-8')
    const options = parseCandidatesCSV(data)

    res.status(200).json(options)

  } catch (error) {
    console.error('Erro ao ler o arquivo:', error)
    res.status(500).json({ error: 'Erro ao ler o arquivo.' })
  }
}

function parseCandidatesCSV(data) {
  const options = []

  data.split("\n").forEach(option => {
    const [tipoEleicao, numeroCandidato, nomeCandidato, urlFoto] = option.split(",")

    options.push({
      tipoEleicao,
      numeroCandidato: +numeroCandidato,
      nomeCandidato,
      urlFoto
    })
  })

  return options
}

export default cargaInicial