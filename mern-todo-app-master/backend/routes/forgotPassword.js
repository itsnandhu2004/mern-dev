import express from "express"
import { forgotPassword, resetPassword } from "../controllers/forgotPasswordController.js"

const router = express.Router();
router.post("/forgotPassword", forgotPassword)
router.post("/resetPassword", resetPassword)
router.get("/", (req, res) => {
    res.json({ message: "User route is working!" });
});
export default router;