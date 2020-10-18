const express = require('express')
const app = express()
var bodyParser = require('body-parser');
var path=require('path');
var crypto=require('crypto');
const {Deta}=require('deta');
app.use(bodyParser.urlencoded({extended:true}));
const deta=Deta(process.env.DETA_KEY)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(bodyParser.json());

const db=deta.Base('simurl');
app.get('/', (req, res) => res.render('home',{url:" "}))
app.post('/a/add',async (req,res)=>{
    let nslug=req.body.slug+crypto.randomBytes(1).toString('hex');
    await db.put({
        slug:nslug,
        url:req.body.url
    })
    let nurl="https://o6ippn.deta.dev"+'/'+nslug;
    res.render('sucess',{url:nurl,sl:nslug})
});
app.get('/:id',async (req,res)=>{
    const a=await db.fetch({slug:req.params.id}).next()
    res.status(301).redirect(a.value[0].url)
});

module.exports = app