import express = require("express");
import { container } from "app/services/injection-config";
import * as HttpStatus from 'http-status-codes'

const router = express.Router();
const authService = container.AuthService;
const userService = container.UserService;

router.post('/login', (req, res, next) => {
    const {login, password} = req.body;
    authService.loginUser(login, password)
        .then(authData => {
            res.status(HttpStatus.OK).json(authData);
        }).catch(next);
});

router.post('/register', (req, res, next) => {
    userService.createUser(null, req.body)
        .then((user)=>res.status(HttpStatus.CREATED).json(user))
        .catch(next)
})

export const authRouter = router;