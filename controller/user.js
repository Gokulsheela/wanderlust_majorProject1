const user=require("../models/user.js");

module.exports.signupRenderUser=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.createSignupUser=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newUser= new user({email,username});
   await user.register(newUser,password);
    req.flash("success","welcome");
    res.redirect("/listings");
    }catch(e){
        console.log(e);
        req.flash("err","Username already existed");
        res.redirect("/signup");
    }
    
};

module.exports.renderLoginUser=(req,res)=>{
        res.render("users/login.ejs");
}

module.exports.createLoginUser=(req,res)=>{
        req.flash("success","welcome back");
       let redirect=res.locals.redirectUrl || "/listings";
       console.log(redirect);
        res.redirect(redirect);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","logout successfully");
        res.redirect("/login");
    });
}