import { Router } from "express"
import UserController from "./app/controllers/UserController.js"

const router = Router()

//retorna lista de users
router.get("/user", UserController.index)

//retorna um user por id passada
router.get("/user/:id", UserController.show)

//cria novo user
router.post("/user", UserController.store)

//atualiza dados de user (recebe user id)
router.put("/user/:id", UserController.update)

//deleta user (recebe user id)
router.delete("/user/:id", UserController.delete)

// autentica user
router.post("/user/auth", UserController.auth)

export default router