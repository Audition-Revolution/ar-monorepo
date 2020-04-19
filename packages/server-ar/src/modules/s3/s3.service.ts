import * as dotenv from "dotenv";
dotenv.config();
import {InjectRepository} from "@nestjs/typeorm";
import {Injectable, Req, Res} from "@nestjs/common";
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import {Repository} from "typeorm";
import {UserImage} from "../user/UserImage.entity";
import {AuditionCollateral} from "../organization/features/project/features/audition/AuditionCollateral.entity";

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const s3 = new aws.S3();
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1",
});

@Injectable()
export class S3Service {
    private upload = multer({
        storage: multerS3({
            s3,
            bucket: AWS_S3_BUCKET_NAME,
            acl: "public-read",
            key(request, file, cb) {
                cb(null, `${Date.now().toString()}-${file.originalname}`);
            },
        }),
    }).array("upload", 1);

    constructor(
        @InjectRepository(UserImage)
        private readonly userImageRepo: Repository<UserImage>,
        @InjectRepository(AuditionCollateral)
        private readonly auditionCollateralRepo: Repository<AuditionCollateral>,
    ) {
    }

    async getUrlForObject(key: string) {
        const response = await s3.getSignedUrl("getObject", {
            Bucket: AWS_S3_BUCKET_NAME,
            Key: key,
            Expires: 60 * 5,
        });
        return response;
    }

    async userImageUpload(@Req() req, @Res() res) {
        try {
            this.upload(req, res, async (error) => {
                    if (error) {
                        return res.status(404).json(`Failed to upload image file: ${error}`);
                    }
                    await this.userImageRepo.save({
                        s3Key: req.files[0].key,
                        userId: req.user.id,
                    });
                    return res.status(201).json(req.files[0].key);
                },
            )
            ;
        } catch (error) {
            return res.status(500).json(`Failed to upload image file: ${error}`);
        }
    }

    async auditionCollateralUpload(roleId: string, @Req() req, @Res() res) {
        try {
            this.upload(req, res, async (error) => {
                    if (error) {
                        return res.status(404).json(`Failed to upload image file: ${error}`);
                    }
                    const saved = await this.auditionCollateralRepo.save({
                        s3Key: req.files[0].key,
                        userId: req.user.id,
                        role: roleId,
                    });
                    return res.status(201).json(saved);
                },
            )
            ;
        } catch (error) {
            return res.status(500).json(`Failed to upload image file: ${error}`);
        }
    }

    async deleteImage(key: string) {
        await this.userImageRepo.delete({
            s3Key: key,
        });
        await s3.deleteObject({
            Bucket: AWS_S3_BUCKET_NAME,
            Key: key,
        });

        return {
            data: "Deleted",
        };
    }

    async getMainImageUrl(s3Results) {
        return await this.getUrlForObject(s3Results[0].s3Key);

    }
}
