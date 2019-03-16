var validUrl = require('valid-url');
  
   
function getShortUrl( longUrl){
    if (validUrl.isUri(longUrl)){
        const myURL = new URL(longUrl);

        let shortName = "cats/"+myURL.host.slice(0, 5);

        const random = Math.floor(Math.random() * 5000);;
        
        let shortUrl = shortName + "/"+random;
        return shortUrl;
       
    } else {
        return false;
    }

}

module.exports = {getShortUrl}
