const express=require("express");
const router=express.Router();

const ExpressError =require("../utils/ExpressError.js");
const wrapAsync =require("../utils/wrapAsync.js");
const listing =require("../models/listing.js");
const {listingSchema,reviewSchema} =require("../schema.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const controller=require("../controller/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage });


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
router.
    route("/")
    .get( wrapAsync(controller.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
         validateListing,
        wrapAsync(controller.createListings)
    );

router.get("/new",isLoggedIn,controller.renderNewForm);
router
    .route("/:id")
    .get(wrapAsync(controller.showListings))
    .put(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(controller.updateListings))
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(controller.destroyListings));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(controller.renderEditForm));

module.exports= router;