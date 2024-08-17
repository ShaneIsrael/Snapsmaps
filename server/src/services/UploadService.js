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

service.uploadImage = (fileContent, path, contentType) => {
  // remove any forward slash from the beginning of the path to prevent
  // a root directory being created in the S3 storage.
  const mutatedPath = path.replace(/^\//, '')
  const params = {
    Bucket: 'snapsmaps',
    Key: mutatedPath,
    Body: fileContent,
    ACL: 'public-read',
    ContentType: contentType,
  }

  return s3.upload(params).promise()
}

module.exports = service
