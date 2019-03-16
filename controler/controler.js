const http = require("http");
const ejs = require("ejs");
const fs = require("fs");
const url = require("url");
const open = require("open");
const path = require("path");



const UrlModel = require("../model/UrlModel");

var htmlContent = fs.readFileSync(__dirname + '/../views/index.ejs', 'utf8');
let htmlRenderized = ejs.render(htmlContent, {
  filename: 'index.ejs',
  shortenUrl: '',
  invalidUrl : ""
});


const db = require("./db");
const collection = "url";

db.connect(err => {
  if (err) {
    console.log("unable to connect to database");
    process.exit(1);
  } else {

    console.log("connected to datatbase");

  }
});



function send404response(response) {
  response.writeHead(404, {
    "Content-Type": "text/plain"
  });
  response.write("Error 404 , Page Not Found");
  response.end();
}

function onRequest(req, res) {

  const reqUrl = url.parse(req.url, true);

  if ((req.method === "GET" && reqUrl.pathname == "/")) {


    // print reqUrl then you will get full object 
      let htmlRenderized = ejs.render(htmlContent, {
        filename: 'index.ejs',
        shortenUrl: '',
        invalidUrl : ""
      });
      res.end(htmlRenderized);

    

  }else if((req.method === "GET" && reqUrl.pathname == "/shorten")){
    if (reqUrl.query.url) {

      db.getDB()
        .collection(collection).findOne({
          shortUrl: reqUrl.query.url
        }, function (err, result) {
          if (err) throw err;
          if (result) {

            open(result.longUrl, "chrome", function (err) {
              if (err) throw err;
            });
  
          }else{
            res.end(JSON.stringify({'valid':false,  'invalidUrl' : "url is invalid !"}));
          }
        });

    }
  } 
  else if(req.url.match("\.js$")){
    // all js file read by node js
     
      var fileStream = fs.createReadStream(__dirname + '/../js/main.js',"UTF-8");
      res.writeHead(200,{"Content-Type":"text/js"});
      fileStream.pipe(res);
  }else if ((req.method === "POST" && reqUrl.pathname == "/")) {

    var jsonString = '';

    req.on('data', function (data) {
      jsonString += data;
    });

    console.log(jsonString);

    req.on('end', function () {
      var data = JSON.parse(jsonString);
      var shortUrl = UrlModel.getShortUrl(data.longUrl);
      if(!shortUrl){
        
        res.end(JSON.stringify({'valid':false,  'invalidUrl' : "url is invalid !"}));
      }
     else{
      data.shortUrl = shortUrl;
      db.getDB()
        .collection(collection).findOne({
          longUrl: data.longUrl
        }, function (err, result) {
          if (err) throw err;
          if (result) {
              
            res.end(JSON.stringify({'valid' : true,'shortUrl':result.shortUrl}));
          } else {
            db.getDB()
              .collection(collection)
              .insertOne(data, (err, result) => {
                if (err) console.log("insert err " + err);
                else {

                  
                  res.end(JSON.stringify({'valid' : true,'shortUrl':data.shortUrl}));
                

                }

              });
          }



        });


     }

    });



  } else if (req.url === "/about") {
    res.writeHead(200, {
      "Content-Type": "text/plain"
    });
    res.write("About page");
  } else {
    send404response(res);
  }
}

module.exports = http.createServer(onRequest);