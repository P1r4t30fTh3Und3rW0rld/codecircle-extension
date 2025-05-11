const express = require("express");
const { linkLeetCodeAccount , getAllLinkedAccounts, deleteLeetCodeAccount } = require("../controllers/userController.js");

const router = express.Router();
router.post("/link", linkLeetCodeAccount);
router.get("/accounts", getAllLinkedAccounts);
router.delete('/:_id', deleteLeetCodeAccount);

module.exports = router;
