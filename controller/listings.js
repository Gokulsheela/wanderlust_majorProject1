const listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index=(async (req,res)=>{
    const allListings=await listing.find();
    res.render("listings/index.ejs",{allListings})   
});

module.exports.showListings=(async (req,res)=>{
    let{id}=req.params;
    const listings= await listing.findById(id)
        .populate({
        path:"reviews",
        populate:{
            path:"auther",
        },
    })
    .populate("owner");
    res.render("listings/show.ejs",{listings})
});

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createListings=async(req,res,next)=>{
    // let listing=req.body.listing;
    // const newListing= new listing(listing);
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data");//hoppscotch use cheyth oru post request send cheythal handdle cheyyan}

 let response= await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
  })
  .send()

  

    const url=req.file.path;
    const filename=req.file.filename;
    const newListing=new listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","listing added successfully");
    res.redirect("/listings");
    
};
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let list= await listing.findById(id);
    let orginalImageUrl=list.image.url;
    orginalImageUrl.replace("/upload","/upload/width_100"); 
    console.log(orginalImageUrl);
    res.render("listings/edit.ejs",{list,orginalImageUrl});
};

module.exports.updateListings=async(req,res)=>{
    let {id}=req.params;
    if(!req.body.listing){
        throw new ExpressError(400,"enter valid data");
    }
   const list= await listing.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file!=="undefined"){
        const url=req.file.path;
        const filename=req.file.filename;
        list.image={url,filename};
        await list.save();
   }
   
    res.redirect(`/listings/${id}`);//show route il redirect

};

module.exports.destroyListings=async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","listing delete successfully");
    res.redirect("/listings");
};