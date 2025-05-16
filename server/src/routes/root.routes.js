import { Router } from 'express'

class RootRoutes {
  router = Router()
  constructor() {
    this.initizeRoutes()
  }

  initizeRoutes() {
    this.router.get('/', (req, res, next) =>
      res.status(200).json({
        message: 'Welcome to the API',
      }),
    )
  }
}

export default new RootRoutes().router
