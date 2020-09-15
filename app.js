const express =require("express");
const bodyParser=require("body-parser")
const app=express();
const mongoose=require("mongoose");
let https=require("https");
app.set("view engine","ejs");
let _=require("lodash");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
let homecontent="Content from blog - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
let blogcontent="Content from blog - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
let composecontent="Content from Compose - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
let postedItems=[];
let newpostCount='';
const func1=require(__dirname+"/public/dtae.js")
if(func1.date()==0){
    newpostCount=0;
};

//mongoose.connect("mongodb://localhost:27017/blogpostDB",{useNewUrlParser:true,useUnifiedTopology: true });
//We got Below url from MongoDb atlas
//mongodb+srv://Ramesh-admin:<password>@cluster0-4gabr.mongodb.net/<dbname>?retryWrites=true&w=majority
//Made below changes.
//Step 1: Changed password
//Step 2: Changed DB name 

//mongodb+srv://Ramesh-admin:3UJMYz8YMyV27ZgV@cluster0-4gabr.mongodb.net/blogpostDB

//Here is our final URL to connect Cloud based Atlas.
mongoose.connect("mongodb+srv://Ramesh-admin:3UJMYz8YMyV27ZgV@cluster0-4gabr.mongodb.net/blogpostDB",{useNewUrlParser:true,useUnifiedTopology: true });


const itemsSchema=mongoose.Schema(
    {
    posttitle:String,
    postcontent:String
});
const item=mongoose.model("items",itemsSchema);
//console.log(item);

app.get("/",(req,res)=>{
       
    res.render("index",{title:"Home",titlecontent:homecontent,postedItems:"",newpostCount:newpostCount,temp1:mintemp,temp2:maxtemp});    
});
app.get("/home",(req,res)=>{  
     
    res.render("index",{title:"Home",titlecontent:homecontent,postedItems:"",newpostCount:newpostCount,temp1:mintemp,temp2:maxtemp});    
});
app.get("/compose",(req,res)=>{  
     
    res.render("index",{title:"Compose",titlecontent:composecontent,postedItems:"",newpostCount:newpostCount,temp1:mintemp,temp2:maxtemp});    
});
app.get("/myblog",(req,res)=>{  
    item.find((err,item)=>{
        if(err){
            console.log(err)
        }
        else {
            res.render("index",{title:"Myblog",titlecontent:blogcontent,postedItems:item,newpostCount:newpostCount,temp1:mintemp,temp2:maxtemp});
        }
    })
        
});

app.post("/Compose",(req,res)=>{
    //console.log(req.body);
    
    let newpost={
    posttitle:req.body.texpost,
    postcontent:req.body.textcontent
}
item.insertMany([newpost],(err,item)=>{
    if(err){
        console.log(err)
    }
    else {
        newpostCount=Number(newpostCount)+1;
        
        

       // console.log(item)
    }
})
res.redirect("/myblog")
});
let title1='';
app.get("/:postname",(req,res)=>{
   title1 =req.params.postname;
    res.render("article",{title:title1,titlecontent:blogcontent,postedItems:item,temp1:mintemp,temp2:maxtemp,newpostCount:newpostCount});

});

app.post("/update",(req,res)=>{
    //console.log(req.body);
    let a=req.body.name;
    console.log(a);
    item.deleteOne({"posttitle":a},(err,item)=>{
        if(err){
            console.log(err);
        }
        else {
            newpostCount=Number(newpostCount)-1;
            //console.log(item)nam
        }
        res.redirect("/myblog")
    })
    
   
});;
let mintemp='';
let maxtemp='';
app.post("/weather",(req,res)=>{
    let zip1=req.body.pincode;
    let url="https://api.openweathermap.org/data/2.5/weather?zip="+zip1+",in&appid=27de9d44d39e6168544aff83da043d57&units=metric";
    https.get(url,(res1)=>{  
    res1.on("data",(data1)=>{
        let fdata=JSON.parse(data1);
        let mintemp=fdata.main.temp_min;
        let maxtemp=fdata.main.temp_max;
        res.render("index",{title:title1,titlecontent:blogcontent,postedItems:item,temp1:mintemp,temp2:maxtemp,newpostCount:newpostCount});
     
    }); 
    
});
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,(err,suc)=>{
    if(err){

    }
    else {
        console.log("Port is running fine");
    }
});