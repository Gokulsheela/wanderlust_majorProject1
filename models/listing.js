const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const review=require("./review.js");
const user=require("./user.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        filename:String,
        url:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});
listingSchema.post("findOneAndDelete",async (listing)=>{
    console.log(listing);
    if(listing){
       let a= await review.deleteMany({_id : {$in: listing.reviews}});
       console.log(a);
    }
})
const listing=mongoose.model("listing",listingSchema);
module.exports=listing;

