var express=require('express');
var bodyParser=require('body-parser');
var mon=require('mongoose');
require('dotenv').config();
var bodyParser = require('body-parser');
var path=require('path');
var crypto=require('crypto');
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
        ur.url=req.body.url;
        ur.slug=req.body.slug;
        ur.save((err,doc)=>{
           if(!err){
               url=req.get('host')+'/'+req.body.slug;
               res.render('sucess',{url:url});
           }
           else{
            const ur=new u();
            ur.url=req.body.url;
            ur.slug=req.body.slug+crypto.randomBytes(2).toString('hex');
            ur.save((err)=>{
                if(!err){
                    url=req.get('host')+'/'+ur.slug;
                    res.render('sucess',{url:url});
                }
                });
           }
        });
       
    
    
});
app.get('/:id',(req,res)=>{
    u.findOne({slug:req.params.id},(err,doc)=>{
        try{
        res.status(301).redirect(doc.url);}
        catch(err){
            res.status(404).send("URL WHICH WAS COVERTED IS MISSING ");
        }
    });
});


app.listen(8080,()=>{
    console.log("server on 8080")
})

//When it comes to routing create another file so that you could add the routing functionalites there using 'express.Router' rather than adding routes in the server.js file
