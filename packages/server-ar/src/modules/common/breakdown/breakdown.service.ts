import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {BreakdownAttribute, BreakdownCategory, BreakdownType} from "./BreakdownAttribute.entity";
import {ProjectRole} from "../../organization/features/project/ProjectRole.entity";
import {User} from "../../user/User.entity";

@Injectable()
export class BreakdownService {
    constructor(
        @InjectRepository(BreakdownAttribute)
        private readonly breakdownRepo: Repository<BreakdownAttribute>,
    ) {
    }

    async addRoleBreakdown(breakdownObject: any, projectRole: ProjectRole) {
        await this.breakdownRepo.delete({projectRole});
        await this.saveAllBreakdowns(breakdownObject, {projectRole}, BreakdownType.ROLE);
        return {
            message: "Success",
        };
    }

    async addUserBreakdown(breakdownObject: any, user: User) {
        await this.breakdownRepo.delete({user});
        await this.saveAllBreakdowns(breakdownObject, {user}, BreakdownType.TALENT);

        return {
            message: "Success",
        };
    }

    private addBreakdownType(breakdownObject: any, typeName: string, userOrRoleId, type: BreakdownType, category: BreakdownCategory) {
        if (breakdownObject[typeName]) {
            return breakdownObject[typeName].map((value) => {
                return this.breakdownRepo.save({
                    type, category, value, ...userOrRoleId,
                });
            });
        }
    }

    private async saveAllBreakdowns(breakdownObject: any, userOrRoleId: any, type: BreakdownType) {
        return await Promise.all([
            this.addBreakdownType(breakdownObject, "ethnicity", userOrRoleId, type, BreakdownCategory.ETHNICITY),
            this.addBreakdownType(breakdownObject, "unions", userOrRoleId, type, BreakdownCategory.UNION),
            this.addBreakdownType(breakdownObject, "gender", userOrRoleId, type, BreakdownCategory.GENDER),
            this.addBreakdownType(breakdownObject, "ageRange", userOrRoleId, type, BreakdownCategory.AGE_RANGE),
            this.addBreakdownType(breakdownObject, "vocalRange", userOrRoleId, type, BreakdownCategory.VOCAL_RANGE),
            this.addBreakdownType(breakdownObject, "vocalRange", userOrRoleId, type, BreakdownCategory.VOCAL_RANGE),
        ]);
    }

    static formatBreakdown(breakdowns) {
        return breakdowns.reduce((acc, breakdown) => {
            switch (breakdown.category) {
                case BreakdownCategory.GENDER:
                    if (acc.gender) {
                        acc.gender.push(breakdown.value);
                    } else {
                        acc.gender = [breakdown.value];
                    }
                    break;
                case BreakdownCategory.UNION:
                    if (acc.unions) {
                        acc.unions.push(breakdown.value);
                    } else {
                        acc.unions = [breakdown.value];
                    }
                    break;
                case BreakdownCategory.AGE_RANGE:
                    if (acc.ageRange) {
                        acc.ageRange.push(breakdown.value);
                    } else {
                        acc.ageRange = [breakdown.value];
                    }
                    break;
                case BreakdownCategory.ETHNICITY:
                    if (acc.ethnicity) {
                        acc.ethnicity.push(breakdown.value);
                    } else {
                        acc.ethnicity = [breakdown.value];
                    }
                    break;
                case BreakdownCategory.VOCAL_RANGE:
                    if (acc.vocalRange) {
                        acc.vocalRange.push(breakdown.value);
                    } else {
                        acc.vocalRange = [breakdown.value];
                    }
                    break;
                default:
                    break;
            }
            return acc;
        }, {});
    }
}
