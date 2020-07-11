import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { S3Service } from "../s3/s3.service";
import { Training } from "./Training.entity";
import {
    CommercialExperience,
    FilmExperience,
    MusicalTheatreExperience,
    OperaExperience,
    TelevisionExperience,
    TheatreExperience,
} from "./Experience.entity";
import { SpecialSkill } from "./SpecialSkills.entity";
import { BreakdownAttribute } from "../common/breakdown/BreakdownAttribute.entity";
import { ActorNote } from "./features/actor-note/ActorNote.entity";
import { ActorTag } from "./features/actor-tag/ActorTag.entity";
import { User } from "./User.entity";
import { UserType } from "../../modules/user/User.entity";

@Injectable()
export class UserSearchService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(BreakdownAttribute)
        private readonly breakdownRepo: Repository<User>,
        private s3Service: S3Service,
        @InjectRepository(SpecialSkill)
        private readonly skillRepo: Repository<SpecialSkill>,
        @InjectRepository(Training)
        private readonly trainingRepo: Repository<Training>,
        @InjectRepository(TheatreExperience)
        private readonly theatreRepo: Repository<TheatreExperience>,
        @InjectRepository(MusicalTheatreExperience)
        private readonly musicalTheatreRepo: Repository<MusicalTheatreExperience>,
        @InjectRepository(OperaExperience)
        private readonly operaRepo: Repository<OperaExperience>,
        @InjectRepository(FilmExperience)
        private readonly filmRepo: Repository<FilmExperience>,
        @InjectRepository(TelevisionExperience)
        private readonly televisionRepo: Repository<TelevisionExperience>,
        @InjectRepository(CommercialExperience)
        private readonly commercialRepo: Repository<CommercialExperience>,
        @InjectRepository(ActorTag)
        private readonly actorTagRepo: Repository<ActorTag>,
        @InjectRepository(ActorNote)
        private readonly actorNoteRepo: Repository<ActorNote>,
    ) {
    }

    verifiedOrImportedFromTheatreDatabase(results, ownerEmail) {
        results.andWhere(new Brackets(subQuery => {
            subQuery.where("user.verified = true");
            subQuery.orWhere(":ownerEmail = ANY(\"user\".\"importSourceEmails\")");
        })).setParameter("ownerEmail", ownerEmail);
        return results;
    }

    async searchTag(searchVal: string, ownerId: string, ownerEmail: string) {
        const notes = this.actorNoteRepo.createQueryBuilder("note")
            .select("DISTINCT on (note.forId) note.forId as userId")
            .where("LOWER(note.text) LIKE LOWER(:search)", { search: "%" + searchVal + "%" })
            .andWhere("note.ownerId = :owner", { owner: ownerId })
            .getRawMany();
        const tag = this.actorTagRepo.createQueryBuilder("note")
            .select("DISTINCT on (note.forId) note.forId as userId")
            .where("LOWER(note.tag) LIKE LOWER(:search)", { search: "%" + searchVal + "%" })
            .andWhere("note.ownerId = :owner", { owner: ownerId })
            .getRawMany();
        const unique = (value, index, self) => {
            return self.indexOf(value) === index;
        };
        const exp = await Promise.all([notes, tag])
            .then(vals => vals.flat().map(v => v.userid))
            .catch(err => {
                throw new Error("Query failed");
            });
        const uniqueIds = exp.filter(unique);

        let results: any = await this.userRepo
            .createQueryBuilder("user")
            .select(["user.id", "user.firstName", "user.lastName", "user.email", "user.city", "user.state"])
            .leftJoinAndSelect("user.profileImages", "userImage")
            .leftJoinAndSelect("user.breakdown", "breakdown")
            .where("user.id in (:...users)").setParameter("users", uniqueIds);
        results = this.verifiedOrImportedFromTheatreDatabase(results, ownerEmail);
        results = await results.getManyAndCount();
        return await this.formatResults(results);
    }

    async searchKeyword(searchVal: string, breakdown, ownerEmail: string) {
        const skills = this.skillRepo.createQueryBuilder("skill")
            .select("DISTINCT on (skill.userId) skill.userId as userId")
            .where("LOWER(skill.text) LIKE LOWER(:search)", { search: "%" + searchVal + "%" })
            .getRawMany();
        const training = this.trainingRepo.createQueryBuilder("training")
            .select("DISTINCT on (training.userId) training.userId as userId")
            .where("LOWER(training.text) LIKE LOWER(:search)", { search: "%" + searchVal + "%" })
            .getRawMany();
        const experiences = ["theatreRepo", "musicalTheatreRepo", "operaRepo", "filmRepo", "televisionRepo", "commercialRepo"];
        const queries = experiences.map((repo) => {
            return this[repo].createQueryBuilder("exp")
                .select("DISTINCT on (exp.userId) exp.userId as userId")
                .where("LOWER(exp.project) LIKE LOWER(:search)", { search: "%" + searchVal + "%" })
                .orWhere("LOWER(exp.role) LIKE LOWER(:search)", { search: "%" + searchVal + "%" })
                .orWhere("LOWER(exp.company) LIKE LOWER(:search)", { search: "%" + searchVal + "%" })
                .orWhere("LOWER(exp.director) LIKE LOWER(:search)", { search: "%" + searchVal + "%" })
                .getRawMany();
        });
        const unique = (value, index, self) => {
            return self.indexOf(value) === index;
        };
        const exp = await Promise.all([...queries, skills, training])
            .then(vals => vals.flat().map(v => v.userid))
            .catch(err => {
                throw new Error("Query failed");
            });
        const uniqueIds = exp.filter(unique);
        console.log(uniqueIds.length);
        let results: any = await this.userRepo
            .createQueryBuilder("user")
            .select(["user.id", "user.firstName", "user.lastName", "user.email", "user.city", "user.state"])
            .leftJoinAndSelect("user.profileImages", "userImage")
            .leftJoinAndSelect("user.breakdown", "breakdown")
            .where("user.id in (:...users)").setParameter("users", uniqueIds);

        results = this.verifiedOrImportedFromTheatreDatabase(results, ownerEmail);
        results = await results.getManyAndCount();
        console.log(results);
        return await this.formatResults(results);
    }

    async searchUser(searchVal: string, breakdown?: any, ownerEmail?: string) {

        // The .having line is the difference between inclusive and exclusive results
        let results = await this.userRepo
            .createQueryBuilder("user")
            .select(["user.id", "user.firstName", "user.lastName", "user.email", "user.city", "user.state", "user.userType"])
            .leftJoinAndSelect("user.profileImages", "userImage")
            .leftJoinAndSelect("user.breakdown", "breakdown");
        results = this.verifiedOrImportedFromTheatreDatabase(results, ownerEmail);
        results.andWhere("LOWER(user.displayName) LIKE LOWER(:displayName)", { displayName: "%" + searchVal + "%" });
        if (breakdown.eyeColor && breakdown.eyeColor.length) {
            results.andWhere("(user.eyeColor in (:...eyeColor))").setParameter("eyeColor", breakdown.eyeColor.map(e => e.toLowerCase()));
        }

        if (breakdown.hairColor && breakdown.hairColor.length) {
            results.andWhere("(user.hairColor in (:...hairColor))").setParameter("hairColor", breakdown.hairColor.map(e => e.toLowerCase()));
        }
        if (breakdown.unions && breakdown.unions.length) {
            if (!(breakdown.unions.includes("Non-Union") && breakdown.unions.includes("Union"))) {
                results.andWhere(() => {
                    const query = this.breakdownRepo
                        .createQueryBuilder("inner_breakdown")
                        .select(["inner_breakdown.\"userId\""]);

                    if (breakdown.unions.includes("Non-Union")) {
                        query.where("(inner_breakdown.category = 0 and LOWER(inner_breakdown.value) = 'non-union')");
                    }

                    if (breakdown.unions.includes("Union")) {
                        query.where("(inner_breakdown.category = 0 and LOWER(inner_breakdown.value) != 'non-union')");
                    }

                    const finishedQuery = query.groupBy("inner_breakdown.\"userId\"")
                        .getQuery();
                    return `"user"."id" in (${finishedQuery})`;
                });
            }
        }

        if (breakdown.gender && breakdown.gender.length) {
            const length = Object.values(breakdown.gender).reduce((acc: number, val: any) => {
                if (val.length > 0) {
                    acc += 1;
                }
                return acc;
            }, 0);
            results.andWhere(() => {
                const query = this.breakdownRepo
                    .createQueryBuilder("inner_breakdown")
                    .select(["inner_breakdown.\"userId\""]);

                query.where("(inner_breakdown.category = 1 and LOWER(inner_breakdown.value) in (:...gender))");
                // query.orWhere('(user.gender in (:...gender))');

                const finishedQuery = query.groupBy("inner_breakdown.\"userId\"")
                    // .having('COUNT(distinct inner_breakdown.value) >= :genderLength')
                    .getQuery();
                return `"user"."id" in (${finishedQuery})`;
            }).setParameter("gender", breakdown.gender.map(a => a.toLowerCase()));
        }
        if (breakdown.ageRange && breakdown.ageRange.length) {
            const length = Object.values(breakdown.ageRange).reduce((acc: number, val: any) => {
                if (val.length > 0) {
                    acc += 1;
                }
                return acc;
            }, 0);
            results.andWhere(() => {
                const query = this.breakdownRepo
                    .createQueryBuilder("inner_breakdown")
                    .select(["inner_breakdown.\"userId\""]);

                query.where("(inner_breakdown.category = 2 and inner_breakdown.value in (:...ageRange))");
                const finishedQuery = query.groupBy("inner_breakdown.\"userId\"")
                    // .having('COUNT(distinct inner_breakdown.value) >= :ageLength')
                    .getQuery();
                return `"user"."id" in (${finishedQuery})`;

            }).setParameter("ageRange", breakdown.ageRange);
        }
        if (breakdown.ethnicity && breakdown.ethnicity.length) {
            const length = Object.values(breakdown.ethnicity).reduce((acc: number, val: any) => {
                if (val.length > 0) {
                    acc += 1;
                }
                return acc;
            }, 0);
            results.andWhere(() => {
                const query = this.breakdownRepo
                    .createQueryBuilder("inner_breakdown")
                    .select(["inner_breakdown.\"userId\""])
                    .where("(inner_breakdown.category = 3 and inner_breakdown.value in (:...ethnicity))");
                const finishedQuery = query.groupBy("inner_breakdown.\"userId\"")
                    // .having('COUNT(distinct inner_breakdown.value) >= :ethnicityLength')
                    .getQuery();
                return `"user"."id" in (${finishedQuery})`;

            }).setParameter("ethnicity", breakdown.ethnicity);
        }
        if (breakdown.vocalRange && breakdown.vocalRange.length) {
            results.andWhere(() => {
                const query = this.breakdownRepo
                    .createQueryBuilder("inner_breakdown")
                    .select(["inner_breakdown.\"userId\""]);

                query.andWhere("(inner_breakdown.category = 4 and inner_breakdown.value in (:...vocalRange))");

                const finishedQuery = query.groupBy("inner_breakdown.\"userId\"")
                    // .having('COUNT(distinct inner_breakdown.value) >= :vocalLength')
                    .getQuery();
                return `"user"."id" in (${finishedQuery})`;
            }).setParameter("vocalRange", breakdown.vocalRange);
        }
        try {
            const sql = results.getSql();
            console.log(sql);
            const found = await results.getManyAndCount();
            const result = await this.formatResults(found);
            console.log("Final result");
            return result.filter((user: User) => user.userType.includes(UserType.actor));
        } catch (err) {
            throw new Error(err.message);
        }

    }

    private async formatResults(results) {
        const promises = results[0].map((result) => {
            if (result.profileImages.length) {
                return this.s3Service.getMainImageUrl(result.profileImages).then(url => {
                    result.profilePicture = url;
                    delete result.profileImages;
                    return result;
                });
            } else {
                delete result.profileImages;
                const defPic = "https://image.shutterstock.com/z/stock-vector-default-avatar-profile-icon-grey-photo-placeholder-518740741.jpg";
                result.profilePicture = defPic;
                return result;
            }
        }).sort((a, b) => {
            // equal items sort equally
            if (a.profilePicture === b.profilePicture) {
                return 0;
            } else if (a.profilePicture === null) {
                return 1;
            } else if (b.profilePicture === null) {
                return -1;
            } else {
                return a < b ? 1 : -1;
            }
        });
        return await Promise.all(promises);
    }
}
