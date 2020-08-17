var mon=require('mongoose');
var express=require('express');
require('dotenv').config()
var path=require('path');
var bodyParser=require('body-parser');
app=express();

app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));
app.set('views',path.join(__dirname,"views"));


mon.connect(process.env.ATLAS_URI,{useNewUrlParser: true, useUnifiedTopology: true });

mon.connection.once("open", (err)=>{
    console.log("mongodb connected")
});
let u=require('./model/url.model')
app.get('/',(req,res)=>{
    res.render('main',{err: " "});
});
app.post('/a/add',(req,res)=>{
    
        const ur=new u();
        ur.url=req.body.name;
        ur.slug=req.body.email;
        ur.save((err,doc)=>{
           if(!err){
               url=req.get('host')+'/'+req.body.email
               res.render('sucess',{url:url});
           }
           else{
            res.render('main',{err: "slug aldredy exists"});
           }
        });
       
    
    
});
app.get('/:id',(req,res)=>{
    u.findOne({slug:req.params.id},(err,doc)=>{
        try{
        res.status(301).redirect(doc.url);}
        catch(err){
            console.log("err")
        }
    });
});


app.listen(8080,()=>{
    console.log("server on 8080")
})
