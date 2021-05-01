const fs = require('fs');
const AWS = require('aws-sdk');
const { randomInt } = require('crypto');
const { config } = require('process');
//const express = require('express');
//const router = express.Router();

const ID = 'AKIA2MU3WQQLMHPPIHGJ';
const SECRET = '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';
const REGION = 'ap-southeast-1';

// The name of the bucket that you have creatednpm i
const BUCKET_NAME = 'imagebucketkhambenhonl-1';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
});

const uploadFile = async (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);
    const ran = randomInt(100000000000000);
    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName + ran, // File name you want to save as in S3
        Body: fileContent,
        ContentType :'image/jpeg', //<-- this is what you need!
        ACL         :'public-read'//<-- this makes it public so people can see it
    };

    // Uploading files to the bucket
    return await s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        link = data.Location;
    }).promise();
   
};
//const log = creat();

module.exports = {
    uploadFile 
};