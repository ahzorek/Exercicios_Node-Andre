import { writeFile } from 'fs/promises'

const createConfig = async (req, res) => {
  try {
    const { elec_code, options } = req.body

    const csvFormattedData = options.map(option => {
      return `${option.voteIsAnon ? 'a' : 'b'},${option.num},${option.name},${option.pic} `
    }).join("\n")

    await writeFile(`db/poll_config/config_${elec_code}.csv`, csvFormattedData, 'utf-8')
    res.status(201).json({ status: 'success', message: 'Arquivo CSV criado com sucesso.' })

  } catch (error) {
    console.error('Erro ao criar o arquivo:', error)
    res.status(500).json({ error: 'Erro ao criar o arquivo.' })
  }
}

export default createConfig