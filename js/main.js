
let url = "http://localhost:8080";




document.getElementById("shortenBtnId").addEventListener("click", function() {

        let longUrl = document.getElementById("longUrlId");

        if(!longUrl || 0 === longUrl.length){
            alert("please input the long url");
          
        }
   
        axios.post(url,{
            longUrl:longUrl.value 
        }).then(res=>{
           longUrl.value = "";
          
            if(!res.data.valid){
                var div = document.getElementById("invelidSet");
                    div.innerHTML = res.data.invalidUrl;
            }else{
                document.getElementById('shortUrlId').innerHTML = res.data.shortUrl;
            }
           
          
        })
        .catch(err=> {
           console.log("error happend")
          });



  });

  
document.getElementById("goLongUrlBtn").addEventListener("click", function() {

    let shortUrl = document.getElementById("inputShortenUrlId");

    if(!shortUrl || 0 === shortUrl.length){
        shortUrl.focus();
        
    }

    let stl = url+"/shorten?url="+shortUrl.value ;
    axios.get(stl).
    then(res=>{
       console.log(res);
        if(!res.data.valid){
            var div = document.getElementById("invelidSet");
                div.innerHTML = res.data.invalidUrl;
        }
    })
    .catch(err=> {
       console.log("error happend")
      });



});