const express=require('express');
const https=require('https');
const app=express();
const bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
const port=3000;

app.get('/',function(req,res){
    res.sendFile(__dirname+"/index.html");
})

app.post('/',(req,res)=>{
    const query=req.body.city;
const apiKey="48bdcc465d71a862c32e2589440a1080";
    const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey;
    https.get(url,function(response)
    {
      //  console.log(response);
        response.on("data",function(data){
            //console.log(data);
             const weatherData=JSON.parse(data);
            // const weatherData=data.toString();
            console.log(weatherData);
            // const weatherdesc=weatherData.weather[0].description;
            const weatherdesc=weatherData.main.temp;
             res.write("<h1>The temperature of "+ req.body.city +" is "+weatherdesc + "</h1>");
            res.send();
             // const obj={
            //     name:"Simran",
            //     favGame:"badminton"

            // }
            //console.log(JSON.stringify(obj));
            //turns data to actual javascript object
        })
    })
    //res.write('Server is up and running');
})

app.listen(port,()=>{
   console.log('Server is running on port'+port);
})


//both lines 14 and 15 can convert data to readable format but advantage of using JSON is that it gives data in a more symmetric pattern

//JSON stands for JavaScript Object Notation
//A common use of JSON is to exchange data to/from a web server.

//JSON is a text format for storing and transporting data

//When receiving data from a web server, the data is always a string. Parse the data with JSON.parse() , and the data becomes a JavaScript object.
//JSON format is text only.
//a JavaScript program can easily convert JSON data into JavaScript objects.

//JavaScript has a built in function for converting JSON strings into JavaScript objects:

//JSON.parse()
//JavaScript also has a built in function for converting an object into a JSON string:

//JSON.stringify()

                                    //DIFFERENCE

// JSON                                         //JAVASCRIPT 
// {"name":"John"}                               {name:"john"}

//functions and Date objects are not allowed in JSON.
