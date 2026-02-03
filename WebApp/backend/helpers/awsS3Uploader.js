const config = require("config");
const {
    PutObjectCommand,
    CopyObjectCommand,
    DeleteObjectCommand,
    S3Client,
    ListObjectsCommand,
    GetObjectCommand
} = require("@aws-sdk/client-s3");
const Utils = require("./utils");

class AWSS3Uploader {
    constructor() {
        this.config = config.get("aws");

        this.region = this.config.region || 'ap-south-1'
        this.bucket = this.config.bucket || "civilatorbucket";

        this.aws_s3 = new S3Client({
            credentials: {
                accessKeyId: this.config.accessKey,
                secretAccessKey: this.config.secretKey,
            },
            region: this.region,
        });



        this.aws_base_url = `https://${this.bucket}.s3.${this.region}.amazonaws.com`;
    }

    async createFolder(folderName) {
        try {
            let params = {
                Bucket: this.bucket,
                Key: `${folderName}/`,
            };

            let response = await this.aws_s3.send(new PutObjectCommand(params));

            console.log(response, 'response');

            return response;
        }
        catch (error) {
            console.log(error);
            return false
        }
    }

    async uploadFile(file, fileName, filePath, format, version) {


        try {
            let buffer = await Utils.readFileToBuffer(file.path)

            if (!buffer) return false

            let time = Utils.getCurrentTime()
            let filePathNamed = `${filePath}${fileName}_${time}${version ? `_${version}` : ''}.${format}`;

            filePathNamed = filePathNamed.replace(/ /g, '_');

            let params = {
                Bucket: this.bucket,
                Key: filePathNamed,
                Body: buffer,
                ACL: 'public-read',
                ContentType: file.mimetype,
            };

            let response = await this.aws_s3.send(new PutObjectCommand(params));

            let response_url = `${this.aws_base_url}/${filePathNamed}`;

            return response_url;
        }
        catch (error) {
            console.log(error);
            return false
        }

    }

    async getFile(filePath) {
        try {
            let params = {
                Bucket: this.bucket,
                Key: filePath,
            };

            let response = await this.aws_s3.send(new GetObjectCommand(params));

            console.log(response, 'response');

            return response;
        }
        catch (error) {
            console.log(error);
            return false
        }
    }

    async getTotalFolderSize(folderName) {
        try {
            let params = {
                Bucket: this.bucket,
                Prefix: folderName,
            };

            let response = await this.aws_s3.send(new ListObjectsCommand(params));

            let total_size = 0;

            response.Contents.forEach(file => {
                total_size += file.Size;
            });

            return total_size;
        }
        catch (error) {
            console.log(error);
            return false
        }
    }

    async deleteFolder(folderName) {
        try {
            let params = {
                Bucket: this.bucket,
                Prefix: folderName,
            };

            let response = await this.aws_s3.send(new ListObjectsCommand(params));

            let deletePromises = [];

            response.Contents.forEach(file => {
                let deleteParams = {
                    Bucket: this.bucket,
                    Key: file.Key,
                };

                deletePromises.push(this.aws_s3.send(new DeleteObjectCommand(deleteParams)));
            });

            await Promise.all(deletePromises);

            return true;
        }
        catch (error) {
            console.log(error);
            return false
        }
    }

    async deleteFile(key) {
        try {
            let params = {
                Bucket: this.bucket,
                Key: key,
            };

            let response = await this.aws_s3.send(new DeleteObjectCommand(params));

            console.log(response, 'response');

            return response;
        }
        catch (error) {
            console.log(error);
            return false
        }
    }


}

module.exports = AWSS3Uploader;