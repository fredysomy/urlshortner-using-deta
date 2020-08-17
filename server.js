var express=require('express');
var bodyParser=require('body-parser');
var mon=require('mongoose');
require('dotenv').config();
var bodyParser = require('body-parser');
var path=require('path');
app=express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(bodyParser.json());

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
            res.send("THE PAGE DOENT EXIST")
        }
    });
});


app.listen(8080,()=>{
    console.log("server on 4345")
})
