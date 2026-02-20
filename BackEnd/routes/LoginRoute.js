const router = require("express").Router();
const LoginCtrl = require("../controller/LoginController");

router.post("/signup", LoginCtrl.signup);
router.post("/login", LoginCtrl.login);
router.get("/count", LoginCtrl.countUsers);

/* LIST */
router.get("/getuser", LoginCtrl.getUsers);

/* SEARCH */
router.get("/searchuser", LoginCtrl.searchUsers);

/* UPDATE */
router.put("/:id", LoginCtrl.updateUser);

module.exports = router;
