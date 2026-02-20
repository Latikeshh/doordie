const router = require("express").Router();
const MessageCtrl = require("../controller/MessageController");

/* SEND MESSAGE */
router.post("/send", MessageCtrl.sendMessage);

/* GET CHAT BETWEEN TWO USERS */
router.get("/chat/:user1/:user2", MessageCtrl.getChat);

/* GET ALL USER MESSAGES */
router.get("/user/:userId", MessageCtrl.getUserMessages);

/* MARK AS SEEN */
router.put("/seen/:messageId", MessageCtrl.markAsSeen);

/* MARK AS DELIVERED */
router.put("/delivered/:messageId", MessageCtrl.markAsDelivered);

/* EDIT MESSAGE */
router.put("/edit/:messageId", MessageCtrl.editMessage);

/* SOFT DELETE MESSAGE */
router.delete("/:messageId", MessageCtrl.deleteMessage);

module.exports = router;