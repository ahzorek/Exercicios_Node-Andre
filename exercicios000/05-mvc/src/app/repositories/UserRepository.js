import { nanoid } from 'nanoid'
import { getUserByUsername, getUserById, getUserIndexById, getUsers } from "../db/conexao.js"

class UserRepository {

  //CRUD
  //C for CREATE
  create(user) {
    getUsers().push({
      id: nanoid(8),
      ...user
    })
  }

  //R for READ
  findAll() {
    return getUsers()
  }
  //R
  findById(id) {
    return getUserById(id)
  }
  findByUsername(username) {
    return getUserByUsername(username)
  }

  //U for UPDATE
  update(id, user) {
    const userIndex = getUserIndexById(id)
    const users = getUsers()
    const prev = users[userIndex]

    users[userIndex] = {
      ...prev,
      ...user
    }

    return users[userIndex]
  }

  //D for DELETE
  delete(id) {
    let userIndex = getUserIndexById(id)
    getUsers().splice(userIndex, 1)
  }
}

export default new UserRepository()