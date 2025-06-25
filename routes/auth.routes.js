import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';

class AuthRoutes {
  constructor() {
    this.router = Router();
    this.setRoutes();
  }

  setRoutes() {
    this.router.post('/register', AuthController.register.bind(AuthController));
    this.router.post('/login', AuthController.login.bind(AuthController));
    this.router.get('/logout', AuthController.logout.bind(AuthController));
    this.router.get('/me', AuthController.currentUser.bind(AuthController));
  }

  getRouter() {
    return this.router;
  }
}

export default new AuthRoutes().getRouter();
