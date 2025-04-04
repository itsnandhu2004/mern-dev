import express from "express"
import { addTask, getTask, removeTask} from "../controllers/taskController.js"
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/addTask", requireAuth, addTask)
router.get("/getTask",requireAuth, getTask)
router.get("/removeTask",requireAuth, removeTask)
router.get("/", (req, res) => {
    res.json({ message: "User route is working!" });
});
export default router;