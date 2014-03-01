// JavaScript Document 
var fs = require('fs');
var knox = require('knox');
var client = knox.createClient({
    key: 'AKIAIDZAMIX2REQZACVA',
	secret: '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'
  , bucket: 'bucket222'
});
fs.readFile('Picture12.jpg', function(err, buf){
  var req = client.put('Picture13caricato.jpg', {
      'Content-Length': buf.length
    , 'Content-Type': 'image/jpeg'
  });
  req.on('response', function(res){
    if (200 == res.statusCode) {
      console.log('saved to %s', req.url);
    }
  });
  req.end(buf);
});

client.get('Picture12caricato.jpg').on('response', function(res){
  console.log(res.statusCode);
  console.log(res.headers);
  res.setEncoding('utf8');
  res.on('data', function(chunk){
//    console.log(chunk);
  });
}).end();