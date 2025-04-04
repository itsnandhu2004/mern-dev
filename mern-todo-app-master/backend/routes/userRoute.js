import express from 'express';
import { loginUser, registerUser,getUser } from '../controllers/userController.js';
import requireAuth from '../middleware/requireAuth.js';
const router = express.Router();

router.post("/login",loginUser);
router.post("/register",registerUser);
router.get("/getuser", requireAuth, getUser)
// Test endpoint
router.get("/", (req, res) => {
    res.json({ message: "User route is working!" });
});
export default router;