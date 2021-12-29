var images;
var state=false;
dotenv.config();
var _this = this;
var dealsData=[];
import fs from 'fs';
import https from 'https'
import path from 'path'
import url from 'url'
import sharp from 'sharp';
import util from "util";
import  AWS from "aws-sdk";
import dotenv from "dotenv";
var READFILE=util.promisify(fs.readFile);
var BUCKET_NAME = process.env.AWSBucketName;

var s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    secretAccessKey: process.env.AWSSecretKey,
    accessKeyId: process.env.AWSAccessKeyId,
    bucketName:process.env.AWSBucketName,
});

const mix = {
    color: 'mistyrose',
    amount: 10
}
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);}
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

var uploadToS3 = function (data,orgPath) { return __awaiter(void 0, void 0, Promise, function () {
    var name;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = orgPath;
                return [4, s3.putObject({
                    Key: name,
                    Bucket: BUCKET_NAME,
                    ContentType: 'jpg/png',
                    Body: data,
                    ACL: 'public-read'
                }).promise()];
            case 1:
                _a.sent();
                return [2, "https://" + BUCKET_NAME + ".s3." + process.env.AWS_REGION + ".amazonaws.com/" + name];
        }
    });
}); };

async function run() {
    const params = {
        Bucket: BUCKET_NAME,
        Prefix: '2021/SiyabongaGregory/'
    };

    s3.listObjectsV2(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else{
           data['Contents'].map(async (image) => {// Please, correctly map your array here
                var parsed = url.parse("https://" + BUCKET_NAME + ".s3." + process.env.AWS_REGION + ".amazonaws.com/" + image.Key);
                if(!state)
                {
                   fs.createWriteStream('C:/Work/Temp/'+path.basename(parsed.pathname).toString());
                      https.get(
                        "https://" + BUCKET_NAME + ".s3." + process.env.AWS_REGION + ".amazonaws.com/" + image.Key,
                        async function(response) {
                           const result = await response.pipe(file);
                        }
                    );
                }

                if(state)
                {
                    sharp('C:/Work/Temp/'+path.basename(parsed.pathname))
                        .resize({ width: 500, height: 450 })
                        .png({ quality: 100 })
                        .toBuffer()
                        .then( data => {
                            const imgBuffer = new Buffer.from(data,'base64');
                            const url =  uploadToS3(data, image.Key);
                            console.log('File Uploaded Successfully '+ "https://" + BUCKET_NAME + ".s3." + process.env.AWS_REGION + ".amazonaws.com/" + image.Key);
                        })
                        .catch( err => {
                            console.log(err +'  '+'C:/Work/Temp/'+path.basename(parsed.pathname)  +'   State     ' + state);
                        });
                }
            });

            if(!state) {  // This was nessesary at the beginning of this project but I wil keep it here just for anyone to figure it out what was I doing wrong, so the solution is implement Asynchronous , will uopload an updated project using Asynchronous ---- >  Dankie  <-----
                state=true;
                run();      
            }
        }
    });

}
 run();


