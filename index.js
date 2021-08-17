var AWS = require('aws-sdk');
aws.config.region = 'ap-north-east-1';
var s3 = new AWS.S3();

const paramsToGet = {
    Bucket: 'taylor-transcribe-bucket',
    Key: 'audio.json'
};

const paramsToPut = body => {
    return {
        Bucket: 'taylor-transcribe-bucket',
        Key: 'audio.json',
        Body: JSON.stringify(body),
        ContentType: 'application/json',
        ACL: 'public-read-write'
    }

};

exports.handler = async (event, context, callback) => {

    const res = {
        statusCode: 200,
    }    // s3.putObject(paramsToPut(JSON.stringify({ name: 'Mai Shiraishi', age: 25 })), (err, data) => {
    //     if (err) {
    //         console.log(err, err.stack);
    //     }
    //     context.done();
    // });


    // Write JSON File to S3


    // Read File from S3
    s3.getObject(paramsToGet, (err, data) => {
        if (err) {
            console.log(err);
            callback(err);
        }
        res.body = data.Body.toString();
        callback(null, JSON.stringify(res));
    });

};
