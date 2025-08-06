if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");


const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
// const listing=require("./models/listing.js");
// const review=require("./models/review.js");
// const {listingSRouterchema}= require("./schema.js");
// const {reviewSchema}=require("./schema.js")

const listingsRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const dbUrl=process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
};

const store= MongoStore.create({
    mongoUrl:dbUrl,
     crypto: {
    secret: process.env.SECRET
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("error in mongo session store",err);
})

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //passport-local-mongoose

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
   res.locals.success=req.flash("success");
   res.locals.err=req.flash("err");
   res.locals.currUser=req.user;
    next();
})

app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
// app.set(express.static(path.join(__dirname,"public")));

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";


app.get("/fakeuser",async(req,res)=>{
    let fakeuser=new User({
        email:"gmail.com",
        username:"gokjujjjjjj"
        
    });
    let registerUser= await User.register(fakeuser,"hello workld");
    res.send(registerUser);
})
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"not found"));
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="---invalid-"}=err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{err});
})

app.listen(8080,(req,res)=>{
    console.log("server is listening on port 8080");
});