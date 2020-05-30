const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
app.use(express.static("public"));//for letting the server to access our static files
//that is the local files we need to use app.use(express.static("foldername/filename"));
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(req, res){
  res.sendFile(__dirname+"/signup.html");
})
app.post("/", function(req, res){
  const FirstName = req.body.firstName;
  const LastName = req.body.lastName;
  const Email = req.body.email;
  const Password = req.body.password;
  const data = {
    members: [
      {
        email_address: Email,
        status: "subscribed",
        merge_fields: {
          FNAME: FirstName,
          LNAME: LastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us10.api.mailchimp.com/3.0/lists/8d1b35726d";
  const options = {
    method: "POST",
    auth: "akarsh1:cd5440f1feffc45cdd7a5f0627b9b05d-us10",
  }
  const request= https.request(url, options, function(response){
    if(response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
})





app.listen(process.env.PORT || 3000, function(){//since we are using the
  //heroku server so the port should be selected by them so we are
  //using process.env.PORT and  applying || in the parenthesis tells us that
  //we can run this app on both heroku server and local host 3000.

  console.log("the server is currently running at port 3000");
});
//cd5440f1feffc45cdd7a5f0627b9b05d-us10
//audience-id/list-id: 8d1b35726d
