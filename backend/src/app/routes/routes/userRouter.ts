import express = require("express");
import { container } from "app/services/injection-config";
import * as HttpStatus from 'http-status-codes'

const router = express.Router();
const userService = container.UserService;

router.get('/', (req, res, next) => {
    userService.findUsers(req.userData)
        .then(users => res.status(HttpStatus.OK).json(users))
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    userService.getUserById(req.userData, Number.parseInt(req.params.id))
        .then(user => res.status(HttpStatus.OK).json(user))
        .catch(next);
});

router.post('/', (req, res, next) => {
    userService.createUser(req.userData, req.body)
        .then((user)=>res.status(HttpStatus.CREATED).json(user))
        .catch(next)
});

router.put('/:id', (req, res, next) => {
    userService.updateUser(req.userData, {id: Number.parseInt(req.params.id), ...req.body})
        .then(()=>res.status(HttpStatus.NO_CONTENT).json({}))
        .catch(next)
});

router.delete('/:id', (req, res, next) => {
    userService.deleteUser(req.userData, Number.parseInt(req.params.id))
        .then(() => res.status(HttpStatus.NO_CONTENT).json({}))
        .catch(next);
});

export const userRouter = router;