const Express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const Mongoose = require('mongoose');

var app = new Express();

app.set('view engine','ejs'); 

app.use(Express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// For CORS,Pgm Line no 12 to 29
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200' );

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

Mongoose.connect("mongodb://localhost:27017/contactdb");

const DataModel = Mongoose.model("userdata",{
    name:String,
    email:String,
    message:String,
    mob:String
});

app.get('/',(req,res)=>{
    res.render('index')
  });

app.post('/savedata',(req,res)=>{
    var user = new DataModel(req.body);
    console.log(user);
    var result = user.save((error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send("<script>alert('Successfully Inserted')</script><script>window.location.href='/'</script>");
        }
    });

});

app.get('/viewuserdata',(req,res)=>{
    var result = DataModel.find((error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    });
});
  
  const APIurl = "http://localhost:4000/viewuserdata";
  
app.get('/viewall',(req,res)=>{
    request(APIurl,(error,response,body)=>{
        var data = JSON.parse(body);
        res.send(data);
    });
    
});

app.get('/search',(req,res)=>{
    var item = req.query.q;
    var result = DataModel.findOne({emob:item},(error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    });
  });
  
  const APIurl2 = "http://localhost:4000/search";
  
  app.post('/searchmob',(req,res)=>{
    const x= req.body.emob;
    request(APIurl2+"/?q="+x,(error,response,body)=>{
        var data = JSON.parse(body);
        res.send(data);
    });
  });

app.listen(process.env.PORT||4000,()=>{
    console.log("Server running on port:http://localhost:4000");
  });