//mock db
const users = [
  {
    id: 'N1EMTNpZ',
    nome: "Blaise Pascal",
    ano: 1642,
    contribuicao: ["Pascalina"],
    username: "blaise",
    password: "haskell"
  },
  {
    id: 'lzFc5iul',
    nome: "Ada Lovelace",
    ano: 1833,
    contribuicao: ["Bases da lógica de Programação"],
    username: "adalove",
    password: "lovelace456"
  },
  {
    id: '5H4fLoeB',
    nome: "Tim Berners Lee",
    ano: 1956,
    contribuicao: ["World Wide Web"],
    username: "tim",
    password: "cernwww404"
  },
]

function getUserById(id) {
  return users.filter(user => user.id == id)[0]
}

function getUserByUsername(username) {
  return users.find(user => user.username === username)
}

function getUserIndexById(id) {
  return users.findIndex(user => user.id == id)
}

function getUsers() {
  return users
}

export { getUserById, getUserByUsername, getUserIndexById, getUsers }