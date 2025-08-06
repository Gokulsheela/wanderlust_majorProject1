const express=require("express");
const router=express.Router({mergeParams: true});// parent route le params child ilum varan vendi
const ExpressError =require("../utils/ExpressError.js");
const wrapAsync =require("../utils/wrapAsync.js");
const {reviewSchema} =require("../schema.js");
const { isLoggedIn, isAuther } = require("../middleware.js");
const reviewController=require("../controller/reviews.js");

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//review  app.use("/listings/:id/reviews",Review);
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
router.delete("/:reviewId",isLoggedIn,isAuther,wrapAsync(reviewController.destroyReview));

module.exports=router;