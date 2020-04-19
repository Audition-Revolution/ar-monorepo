import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ActorTag} from "./ActorTag.entity";
import {Repository} from "typeorm";
import {S3Service} from "../../../s3/s3.service";

@Injectable()
export class ActorTagService {
    constructor(
        @InjectRepository(ActorTag)
        private readonly actorTagRepo: Repository<ActorTag>,
        private readonly s3Service: S3Service,
    ) {
    }

    async findDistinctTags(owner): Promise<string[]> {
        const uniqueTags = await this.actorTagRepo.createQueryBuilder("tags")
            .select("DISTINCT tags.tag", "tag")
            .where("tags.ownerId = :owner", {owner})
            .getRawMany();
        return uniqueTags.map((tagObject) => tagObject.tag);
    }

    async findTagsForOwner(owner): Promise<ActorTag[]> {
        const tags = await this.actorTagRepo.find({
            where: {
                ownerId: owner,
            },
            relations: ["for", "for.profilePicture"],
        });

        for (const tag of tags) {
            if (tag.for.profilePicture) {
                const profilePic = tag.for.profilePicture.s3Key;
                const profilePicture = await this.s3Service.getUrlForObject(profilePic).then((url) => {
                    return {
                        url,
                        s3Key: profilePic,
                    };
                });
                tag.for.profilePicture = profilePicture as any;
            }
        }
        return tags;
    }

    async createTag(newTag) {
        return await this.actorTagRepo.save({
            ownerId: newTag.owner,
            forId: newTag.for,
            tag: newTag.tag,
        });
    }

    async deleteTag(newTag) {
        if (newTag.for === "all") {
            return await this.actorTagRepo.delete({
                ownerId: newTag.owner,
                tag: newTag.tag,
            });
        } else {
            return await this.actorTagRepo.delete({
                ownerId: newTag.owner,
                forId: newTag.for,
                tag: newTag.tag,
            });
        }
    }

    async getTagsForUser(owner: string, userId: string) {
        const tags = await this.actorTagRepo.createQueryBuilder("tag")
            .select("tag")
            .where("tag.ownerId = :owner", {owner})
            .andWhere("tag.forId = :userId", {userId})
            .getMany();
        return tags.map((tagObject) => tagObject.tag);
    }
}
