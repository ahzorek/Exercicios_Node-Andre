import { nanoid } from 'nanoid'
import { getUserByUsername, getUserById, getUserIndexById, getUsers } from "../db/conexao.js"

class UserRepository {

  //CRUD
  //C for CREATE
  create(user) {
    console.log(user)
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
  update(id, newData) {
    const userIndex = getUserIndexById(id)
    const users = getUsers()
    const prevData = users[userIndex]

    users[userIndex] = {
      ...prevData,
      ...newData
    }

    return users[userIndex]
  }

  //D for DELETE
  delete(id) {
    const userIndex = getUserIndexById(id)
    getUsers().splice(userIndex, 1)
  }
}

export default new UserRepository()