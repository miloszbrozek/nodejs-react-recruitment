import express = require("express");
import { container } from "app/services/injection-config";
import * as HttpStatus from 'http-status-codes'
import { AppError } from "../middleware/error/AppError";
import { Request } from "express";

const router = express.Router();
const tripService = container.TripService;

const getUserId = (req: Request) => {
    const userIdStr = req.query.userId;
    const userId = userIdStr ? Number.parseInt(userIdStr) : null;
    if(!userId) {
        throw new AppError('userId is a mandatory query parameter', {errCode: 400});
    }
    return userId;
}

// userId query param is required
router.get('/', (req, res, next) => {
    tripService.getUserTrips(req.userData, getUserId(req))
         .then(user => {
         res.status(HttpStatus.OK).json(user);
    }).catch(next);
});

router.get('/:id', (req, res, next) => {
    tripService.getTripById(req.userData, Number.parseInt(req.params.id))
        .then(user => res.status(HttpStatus.OK).json(user))
        .catch(next);
});

router.post('/', (req, res, next) => {
    tripService.createTrip(req.userData, req.body)
        .then((trip)=>res.status(HttpStatus.CREATED).json(trip))
        .catch(next)
});

router.put('/:id', (req, res, next) => {
    tripService.updateTrip(req.userData, {id: Number.parseInt(req.params.id), ...req.body})
        .then(()=>res.status(HttpStatus.NO_CONTENT).json({}))
        .catch(next)
});

router.delete('/:id', (req, res, next) => {
    tripService.deleteTrip(req.userData, Number.parseInt(req.params.id))
        .then(() => res.status(HttpStatus.NO_CONTENT).json({}))
        .catch(next);
});

export const tripRouter = router;
