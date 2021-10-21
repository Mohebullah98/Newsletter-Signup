const express =require("express");
const https = require("https");
const app = express();
const port = 3000;
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
  const firstName=req.body.firstName;
  const lastName =req.body.lastName;
  const email = req.body.Email;
  //adding members 1 at a time, so an array of members that has size 1.
  const data={
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data); //we want the data to be sent in the form of a string
  const url ="https://us5.api.mailchimp.com/3.0/lists/09d72c1201"; //for batch subcribe add /lists/list id to end of url
  const options ={
    method:"POST",
    auth:"Moheb98:d29ee9b3e132b86090853ae21efc9fbbf-us5" //from api reference anystring:apikey

  }
  const request =https.request(url,options,function(response){
    if(response.statusCode==200) res.sendFile(__dirname+"/success.html");
    else res.sendFile(__dirname+"/failure.html");
    response.on("data",function(data){ // waiting for data back from mailchimp server
      console.log(JSON.parse(data));
    })
  })
  //send JSON data to mailchimp server
  request.write(jsonData);
  request.end();
});
app.post("/failure",function(req,res){
  res.redirect("/");// this will redirect us to the home page where the get request for signup.html will be triggered all over again.
})

app.listen(process.env.PORT || port,function(){
  console.log("Server has started up on port 3000");
})
//API KEY
//29ee9b3e132b86090853ae21efc9fbbf-us5
// LIST ID
// 09d72c1201
