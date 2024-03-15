const shortid = require("shortid");

const URL = require("../models/url.models")

async function handleGenerateNewShortUrl(req,res){

    const shortID = shortid();

    const body = req.body;

    if(!body.url) return res.status(400).json({msg : "URL is required"})

    await URL.create({
        shortId : shortID,
        redirectURL : body.url,
        visitHistory: [],
    });

    return res.render("index",{id : shortID})
    // return res.json({id : shortID});
}


async function handleGetAnalyticsUrl(req,res){
    const shortId = req.params.shortId;

    const result = await URL.findOne({shortId});
    return res.json({totalClicks : result.visitHistory.length , analytics : result.visitHistory})
    
}
module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalyticsUrl,
}