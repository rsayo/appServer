const S3 =  require("@aws-sdk/client-s3").S3

exports.s3Client = new S3({
    endpoint: "https://nyc3.digitaloceanspaces.com",
    region: "us-east-1",
    credentials: {
      accessKeyId: "HS6WHO5G4DP2QOFO2F4E",
      secretAccessKey: "0CBJpX38fLGF11QX+cvFvEomxXxjjclMCV2CC3L74n0"
    }
});
