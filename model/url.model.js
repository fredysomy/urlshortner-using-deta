var mon=require('mongoose');

var urlscs=mon.Schema;

var urlschemma=new urlscs({
    url:{type:String,required:true,trim:true},
    slug:{type:String,unique:true,required:true,trim:true}

});

const urls=new mon.model('urls',urlschemma);
module.exports=urls;
