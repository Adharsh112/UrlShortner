const express = require('express');

const urlRoute = require('./routes/url.routes')

const path = require("path");

const { connectToMongoDB } = require("./connect")

const URL = require("./models/url.models")

const staticRoute = require("./routes/staticRouter.routes")

const app = express();

const PORT = 3001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(()=>{
    console.log("mongodb connected")
})

app.set("view engine","ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.get("/test",async (req,res) =>{

    const allUrls = await URL.find({});
    res.render("index",{
        urls : allUrls,
    })  
})

app.use("/url",urlRoute);

app.use("/",staticRoute);

app.get("/:shortId",async (req,res)=>{
    const shortId = req.params.shortId; // Extracts the shortid parameter from the request URL// Logs the shortid parameter

    const entry =  await URL.findOneAndUpdate({
        shortId
    },{
        $push : {
            visitHistory : {
                timestamp : Date.now() // Adds a timestamp to the visit history
            },
        }
    });
    console.log(entry)

    // console.log(entry.redirectURL); // Logs the redirectURL property of the entry
    res.redirect(entry.redirectURL); // Redirects the user to the URL associated with the entry
});

app.listen(PORT,()=>{
    console.log(`server started at PORT : ${PORT}`)
})