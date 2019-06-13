import express = require("express");
import { userRouter } from "./routes/userRouter";
import { errorHandler } from "./middleware/error/errorHandler";
import { authRouter } from "./routes/authRouter";
import { authMiddleware } from "./middleware/auth/authMiddleware";
import { tripRouter } from "./routes/tripRouter";

const router = express.Router();

router.use('/api/auth', authRouter);

router.use(authMiddleware);

router.use('/api/user', userRouter);
router.use('/api/trip', tripRouter);


router.use(errorHandler);

module.exports = router;