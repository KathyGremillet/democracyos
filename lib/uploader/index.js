/**
 * Module dependencies.
 */
var express = require('express');
var app = module.exports = express();
var config = require('lib/config');
var aws = require('aws-sdk');
var t = require('t-component');

/*
 * Respond to GET requests to /s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and the
 * anticipated URL of the image.
 */
app.get('/settings/s3', function(req, res){
    var user = req.user;
    aws.config.update({accessKeyId: config.amazon.username , secretAccessKey: config.amazon.password });
    var file_name = "users/" + user.id + "/" + req.query.file_name;
    var s3 = new aws.S3();
    var s3_params = {
        Bucket: config.amazon.bucket,
        Key: file_name,
        Expires: 60,
        ContentType: req.query.file_type,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
            console.log('error on signed req',err);
        }
        else{
            var return_data = {
                signed_request: data,
                url: 'https://'+config.amazon.bucket+'.s3.amazonaws.com/'+file_name
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
});
