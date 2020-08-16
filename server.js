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
            console.log("err")
        }
    });
});


app.listen('4345',()=>{
    console.log("server on 4345")
})
function isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
  }