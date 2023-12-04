import { writeFile } from 'fs/promises'
import 'dotenv/config'

const registerVote = async (req, res) => {
  try {
    const { poll, vote, createdAt, id = '' } = req.body
    await writeFile(
      `db/poll_results/results_${poll}.csv`,
      `${id},${vote},${createdAt} \n`, { encoding: 'utf-8', flag: 'a' })

    res.status(201).json({ status: 'success', message: 'Voto computado. Arquivo CSV atualizado com sucesso.' })

  } catch (error) {
    console.error(error)
    res.status(500).json(
      { error: 'Erro ao registrar voto, contate o administrador do sistema' }
    )
  }
}

export default registerVote