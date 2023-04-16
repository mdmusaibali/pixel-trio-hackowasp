import {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESSKEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESSKEY,
    region: process.env.S3_BUCKET_REGION,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

export const uploadToS3Bucket = ({
  bucketName,
  folderPath,
  mimeTypes,
  maxFileSizeInBytes,
  requiredFieldInReqBody,
  cbToCallInMetaDataFn,
  cbToCallInKeyFnOfMulterS3,
}) => {
  return multer({
    storage: multerS3({
      s3,
      bucket: bucketName,
      contentType(req, file, cb) {
        cb(null, file.mimetype);
      },
      async metadata(req, file, cb) {
        if (cbToCallInMetaDataFn) {
          try {
            await cbToCallInMetaDataFn(req, file, cb);
          } catch (error) {
            return cb(new Error(error?.message || "Something went wrong"));
          }
        }
        cb(null, { fieldName: file.fieldname });
      },
      async key(req, file, cb) {
        if (cbToCallInKeyFnOfMulterS3) {
          try {
            await cbToCallInKeyFnOfMulterS3(req, file, cb);
          } catch (error) {
            return cb(new Error(error?.message || "Something went wrong"));
          }
        }
        const fileName = req.body[requiredFieldInReqBody];
        const fileType = file.mimetype?.split("/")?.pop();
        cb(null, `${folderPath}/${fileName}.${fileType}`);
      },
    }),
    limits: {
      fileSize: maxFileSizeInBytes,
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = mimeTypes;
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type"));
      }
    },
  });
};

const deleteObjectFromS3Bucket = async ({ bucketName, fileName }) => {
  try {
    console.log({
      Bucket: bucketName,
      Key: fileName,
    });
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });
    const response = await s3.send(command);
    return { success: true, response };
  } catch (error) {
    return { success: false, error };
  }
};

const deleteObjectsFromS3Bucket = async ({ bucketName, ObjectsArray }) => {
  try {
    console.log({
      Bucket: bucketName,
      Delete: {
        Objects: ObjectsArray,
      },
    });
    const command = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: ObjectsArray,
      },
    });
    const { Deleted } = await s3.send(command);
    return { success: true, Deleted };
  } catch (error) {
    return { success: false, error };
  }
};
