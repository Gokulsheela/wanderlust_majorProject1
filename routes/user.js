const express=require("express");
const router=express.Router();
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controller/user.js")

router.
  route("/signup")
  .get((userController.signupRenderUser))
  .post((userController.createSignupUser));

router.
  route("/login")
  .get((userController.renderLoginUser))
  .post(saveRedirectUrl,
  passport.authenticate('local', 
    { failureRedirect:'/login',failureFlash:true}),
   (userController.createLoginUser));

router.get("/logout",(userController.logout));
module.exports=router;
