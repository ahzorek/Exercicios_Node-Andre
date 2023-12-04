import { readFile } from 'fs/promises'
import 'dotenv/config'

const apuracao = async (req, res) => {
  try {
    const data = await readFile(
      `db/poll_results/results_${req.query.poll}.csv`,
      'utf-8'
    )
    const parsedData = parseResultsCSV(data)
    const votingCount = {}

    parsedData.forEach(voto => {
      const numeroCandidato = voto.numeroCandidato

      if (!isNaN(numeroCandidato)) {
        votingCount[numeroCandidato] = (votingCount[numeroCandidato] || 0) + 1
      }

    })

    const results = Object.keys(votingCount).map(numeroCandidato => ({
      numeroCandidato: parseInt(numeroCandidato),
      votes: votingCount[numeroCandidato]
    }))

    results.sort((a, b) => b.votes - a.votes)

    console.log(results)

    res.status(200).json(results)

  } catch (error) {
    console.error('Erro ao ler o arquivo:', error)
    res.status(500).json({ error: 'Erro ao ler o arquivo.' })
  }
}


function parseResultsCSV(data) {
  const votes = []

  data.split("\n").forEach(option => {
    const [tipoEleicao, numeroCandidato, timeStamp] = option.split(",")

    votes.push({
      numeroCandidato: +numeroCandidato,
      timeStamp
    })
  })

  return votes
}

export default apuracao