const express = require("express");
const router = express.Router();
const Conversations = require("../../app/controllers/owner/conversations");

router.get("/conversations", Conversations.renderConversationsPage);

module.exports = router;