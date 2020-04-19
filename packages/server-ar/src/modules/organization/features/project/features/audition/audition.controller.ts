import {Body, Controller, Get, Header, Param, Post, Put, Req, Res, UseGuards} from "@nestjs/common";
import {AuditionService} from "./audition.service";
import {ApiUseTags} from "@nestjs/swagger";
import {AuditionTimeSlotService} from "./audition-time-slot/audition-time-slot.service";
import {AuthGuard} from "@nestjs/passport";
import {S3Service} from "../../../../../s3/s3.service";
import PDFDocument from "pdfkit";
import axios from "axios";
import {User} from "../../../../../user/User.entity";

@ApiUseTags("Project Auditions")
@Controller("api/v1/projects/:projectId/auditions")
export class AuditionController {
    constructor(
        private readonly auditionService: AuditionService,
        private readonly auditionTimeslotService: AuditionTimeSlotService,
        private readonly s3Service: S3Service,
    ) {
    }

    @Get("/:id/pdf")
    @Header("Content-Type", "application/pdf")
    @Header("Content-Disposition", "attachment; filename=test.pdf")
    async pdf(@Req() req, @Res() res, @Param("id") id) {
        // TODO BUILD PDF SERVICE
        const audition = await this.auditionService.findOne(id);
        res.writeHead(200, {
            "Content-Disposition": "attachment;filename=" + audition.name + "-printout.pdf",
        });
        const doc = new PDFDocument();

        doc.pipe(res);

        doc.fontSize(16);
        doc.text(`Audition: ${audition.name}`, {
                width: 410,
                align: "left",
            },
        );
        doc.moveDown();
        doc.fontSize(8);

        for (const tal of audition.talent) {
            const withPicture = await this.getProfilePhotoForUser(tal.user as User);

            if (withPicture.profilePicture && withPicture.profilePicture.url) {
                try {
                    const image = await axios.get(withPicture.profilePicture.url, {responseType: "arraybuffer"});
                    doc.text(withPicture.displayName);
                    doc.image(image.data, {fit: [150, 150]});
                    doc.polygon([doc.x, doc.y], [doc.x + 400, doc.y]).stroke();
                    doc.moveDown();
                    doc.polygon([doc.x, doc.y], [doc.x + 400, doc.y]).stroke();
                    doc.moveDown();
                    doc.polygon([doc.x, doc.y], [doc.x + 400, doc.y]).stroke();
                    doc.moveDown();
                    doc.polygon([doc.x, doc.y], [doc.x + 400, doc.y]).stroke();
                    doc.moveDown();
                    doc.polygon([doc.x, doc.y], [doc.x + 400, doc.y]).stroke();
                    doc.moveDown();
                    doc.polygon([doc.x, doc.y], [doc.x + 400, doc.y]).stroke();
                } catch (e) {
                    doc.text(withPicture.displayName);
                    doc.moveDown();
                }
            }
        }

        doc.end();
    }

    @Post("/:id/collateral")
    @UseGuards(AuthGuard("jwt"))
    async addCollateralToAudition(@Req() req, @Res() res, @Param("id") id) {
        return await this.s3Service.auditionCollateralUpload(req, res, id);
    }

    @Put("/:id/response")
    async respondToAuditionInvite(@Param() params, @Body() body) {
        const response = await this.auditionService.respondToAuditionInvite(body.email, body.responseCode, body.response);
        return response;
        // return await this.timeSlotService.removeTalentFromTimeSlot(params.id);
    }

    async getProfilePhotoForUser(user: User) {
        try {
            const urls = user.profileImages.map(async (img: any) => {
                return await this.s3Service.getUrlForObject(img.s3Key).then((url) => {
                    return {
                        url,
                        s3Key: img.s3Key,
                    };
                });
            });
            const profilePic = (user.profilePicture && user.profilePicture.s3Key) || (user.profileImages[0] && user.profileImages[0].s3Key) || "";
            if (!profilePic) {
                return {
                    ...user,
                    profileImages: [],
                };
            }

            const profilePicture = await this.s3Service.getUrlForObject(profilePic).then((url) => {
                if (!url) {
                    return {
                        url: "https://image.shutterstock.com/z/stock-vector-default-avatar-profile-icon-grey-photo-placeholder-518740741.jpg",
                    };
                } else {
                    return {
                        url,
                        s3Key: profilePic,
                    };
                }
            });
            const resolvedUrls = await Promise.all(urls);
            return {
                ...user,
                profileImages: resolvedUrls,
                profilePicture: {
                    url: "https://image.shutterstock.com/z/stock-vector-default-avatar-profile-icon-grey-photo-placeholder-518740741.jpg",
                    ...profilePicture,
                },
            };
        } catch (e) {
            throw new Error(e.message);
        }

    }
}
