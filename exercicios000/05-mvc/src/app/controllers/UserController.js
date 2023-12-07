import UserRepository from "../repositories/UserRepository.js"

class UserController {

  //list all
  index(req, res) {
    const users = UserRepository.findAll()
    res.status(200).send(users)
  }

  //find by id
  show(req, res) {
    const user = UserRepository.findById(req.params.id)
    res.status(200).json(user)
  }

  auth(req, res) {
    const user = UserRepository.findByUsername(req.body.username)
    if (!user || req.body.password !== user.password) res.status(401).json('user not authed')

    else
      res.status(200).json('success')
  }

  //save new
  store(req, res) {
    const user = UserRepository.findByUsername(req.body.username)
    if (user) res.status(418).send('username already exists')
    else
      UserRepository.create(req.body)
    res.status(201).send("User cadastrado com sucesso")
  }

  //update
  update(req, res) {
    let user = UserRepository.update(req.params.id, req.body)
    res.status(200).json(user)
  }

  //delete
  delete(req, res) {
    UserRepository.delete(req.params.id)
    res.status(200).send(`Usuário ${req.params.id} excluído com sucesso!`)
  }
}

//padrao Singleton (Design Patterns)
export default new UserController