const router = require("express").Router();
const LoginCtrl = require("../controller/LoginController");

router.post("/signup", LoginCtrl.signup);
router.post("/login", LoginCtrl.login);
router.get("/count", LoginCtrl.countUsers);

/* LIST */
router.get("/getuser", LoginCtrl.getUsers);

/* UPDATE */
router.put("/:id", LoginCtrl.updateUser);

/* FORGOT PASSWORD */
router.post("/forgot-password", LoginCtrl.forgotPassword);

module.exports = router;