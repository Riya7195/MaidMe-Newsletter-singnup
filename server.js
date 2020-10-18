//jshint esversion: 6
const express = require("express");//requires installation
const bodyParser = require("body-parser");//requires installation
const request = require("request");//requires installation
const https = require("https");//used to get or post data from anc external resource/url.
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
  const data = { //creating an api reference with a json object called data
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
  const jsonData = JSON.stringify(data);//changes the format of data from json to a sting.
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
      console.log(JSON.parse(data));//will give a specified entry in the hyper terminal
    })
  })
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");//if we clickupon the button on the failure page then it will take us back to the signup page.
})





app.listen(process.env.PORT || 3000, function(){//since we are using the
  //heroku server so the port should be selected by them so we are
  //using process.env.PORT and  applying || in the parenthesis tells us that
  //we can run this app on both heroku server and local host 3000.

  console.log("the server is currently running at port 3000");
});
//Use a Procfile, a text file in the root directory of your application, to explicitly declare what command should be executed to start your app
//web: node index.js should be inide that procfile
//This declares a single process type, web, and the command needed to run it. The name web is important here. It declares that this process type will be attached to the HTTP routing stack of Heroku, and receive web traffic when deployed.
//cd5440f1feffc45cdd7a5f0627b9b05d-us10
//audience-id/list-id: 8d1b35726d
