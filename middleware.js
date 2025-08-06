const listing =require("./models/listing.js");
const review=require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("err","login first");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
   let {id}=req.params;
   let currUser=req.user;
    let list= await listing.findById(id);
    console.log(list);
    if(currUser && currUser._id.equals(list.owner._id)) {
        next();
    }else{
        req.flash("err","no authorized");
       return res.redirect(`/listings/${id}`);
    }
}

module.exports.isAuther=async(req,res,next)=>{
    let currUser=req.user;
    let {id,reviewId}=req.params;
    let reviews= await review.findById(reviewId);
    console.log(reviews);
    if(currUser && currUser._id.equals(reviews.auther._id)){
        next()
    }else{
      req.flash("err","no authorized");
       return res.redirect(`/listings/${id}`);
    }
}