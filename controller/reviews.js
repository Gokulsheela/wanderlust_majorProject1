const review=require("../models/review.js");
const listing=require("../models/listing.js");
module.exports.createReview=async(req,res)=>{
    let{id} =req.params.id;
    let list= await listing.findById(req.params.id);
    let newReview=new review(req.body.review);
    newReview.auther=req.user._id;
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    req.flash("success","review added");
    res.redirect(`/listings/${list._id}`);

};

module.exports.destroyReview=async(req,res)=>{
    console.log("delete")
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted successfully")
    res.redirect(`/listings/${id}`);

};