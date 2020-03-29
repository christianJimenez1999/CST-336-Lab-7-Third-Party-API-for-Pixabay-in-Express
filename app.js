const express = require("express");
const app = express();
const request = require('request');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
var $ = require("jquery")(window);
global.document = document;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("img"));
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
var word = ["dog", "car", "cat", "beach", "goku"];
var api = "https://pixabay.com/api/?key=15449339-62ac8a9f7afcca4e5d396f0b1";

app.get("/", async function(req, res){
    let random = Math.floor(Math.random() * 4);
    let orientation = req.query.orientation;
    
    let data = await image(word[random], orientation);
    
    res.render("index", {"images":data});
});


app.get("/result", async function(req, res){
    let key = req.query.keyword;
    let orientation = req.query.or;
    
    console.log(key);
    console.log(orientation);
    
    
    let data = await image(key, orientation);
    
    res.render("result", {"images":data});
});




function image(keyword, orientation){
    return new Promise(function(resolve, reject){
        request("https://pixabay.com/api/?key=15449339-62ac8a9f7afcca4e5d396f0b1&q=" + keyword + "&orientation=" + orientation, 
                    function(error, response, body){ 
                        if(!error && response.statusCode == 200){ //200 means request succeeded
                            let data = JSON.parse(body);
                            
                            resolve(data);
                            
                            
                        }else{
                            reject(error);
                            console.log(response.statusCode);
                            console.log(error);
                        } 
                        
                    });
    });
}


app.get("*", function(req,res){
    res.send("Page not found");
    res.render("error");
});


//server listener
app.listen("8080", "127.0.0.1", function(){
    console.log("Running Express Server...");
});