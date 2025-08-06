const mongoose=require("mongoose");
const {Schema}=mongoose;
const listing=require("./listing.js")
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

// main()
// .then(()=>{
//     console.log("connected to db");
// })
// .catch((err)=>{
//     console.log(err);
// });
// async function main(){
//     await mongoose.connect(MONGO_URL);
// }


const reviewSchema= new Schema({
    comment:String,
    rating:{
            type:Number,
            min: 1,
            max: 5
        } ,  
    createdAt:{
        type: Date,
        default:Date.now()
    },
    auther:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }
});
const review=mongoose.model("review",reviewSchema);
module.exports=review;

