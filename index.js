const AWS = require('aws-sdk');
const s3 = new AWS.S3({'region':'ap-northeast-1'});

exports.handler = async (event, context, callback) => {
    // Read File from S3

    const data = await s3.getObject(
        {
            Bucket:'taylor-transcribe-bucket',
            Key:'audio.json'
        }).promise()

    return {
        statusCode: 200,
        obj: JSON.parse(data.Body),
    }

};
