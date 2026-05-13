import { Router } from "express";

import {
  createPoll,
  deletePoll,
  getMyPolls,
  getSinglePoll,
  updatePoll
} from "../controllers/poll.controller.js";

import { protect } from "../middleware/auth.middlewere.js";

const router = Router();

router.post("/create", protect, createPoll);

router.get("/my-polls", protect, getMyPolls);

router.get("/:id", protect, getSinglePoll);
router.put("/:id", protect, updatePoll);

router.delete("/:id", protect, deletePoll);

export default router