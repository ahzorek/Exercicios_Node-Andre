import jwt from 'jsonwebtoken'
import { readFile } from 'fs/promises'
const SECRET = process.env.SECRET || 'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2'
const TTE = 60 * 60 * 2 // 2hours

const auth = async (req, res) => {
  try {
    const userIsAuthed = await authUser(req.body)

    if (userIsAuthed) {
      const payload = {
        uuid: userIsAuthed.uuid,
        role: userIsAuthed.role
      }
      const token = jwt.sign(payload, SECRET, { expiresIn: TTE })

      res.cookie('token', token, {
        httpOnly: false,
        maxAge: TTE * 1000, // converter para ms :)
      })
      res.status(301).redirect('/')
    }
    else {
      res.status(401).redirect('/login')
    }


  } catch (error) {
    console.error('erro ao gerar o token:', error)
    res.status(500).send('erro no servidor ao gerar token')
  }
}

async function authUser(user) {
  console.log('USER RECEBIDO', user)

  const usersDb = await readFile('db/users/users.csv', 'utf-8')
  const users = []

  usersDb.split("\n").forEach(option => {
    const [cpf, username, password, role, uuid] = option.split(",")

    users.push({
      cpf: +cpf,
      username,
      password,
      role,
      uuid
    })
  })

  const matchUser = users.find((u) => u.cpf == user.user && u.password === user.pass)
  if (matchUser) return matchUser

  else return false
}

export default auth