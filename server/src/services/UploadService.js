const aws = require('aws-sdk')
const fs = require('fs')

const { environment } = require('../config')

let awsConfig, endpoint, s3

if (environment === 'production') {
  awsConfig = require('../config')[environment].aws
  endpoint = new aws.Endpoint(awsConfig.endpoint)
  s3 = new aws.S3({
    endpoint,
    accessKeyId: awsConfig.access_key_id,
    secretAccessKey: awsConfig.access_key_secret,
  })
}

const service = {}

service.uploadImage = async (fileContent, name, bucket, contentType) => {
  const params = {
    Bucket: bucket,
    Key: name,
    Body: fileContent,
    ACL: 'public-read',
    ContentType: contentType,
  }

  console.log(params)

  const resp = await s3.upload(params).promise()
  return resp
}

module.exports = service
