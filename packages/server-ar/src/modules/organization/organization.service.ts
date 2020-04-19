import {Injectable, NotAcceptableException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import {UserService} from "../user/user.service";
import {User} from "../user/User.entity";
import {Organization} from "./Organization.entity";

@Injectable()
export class OrganizationService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Organization)
        private readonly orgRepo: Repository<Organization>,
        private readonly userService: UserService,
    ) {
    }

    async findAll(): Promise<Organization[]> {
        return await this.orgRepo.find();
    }

    async findAllForUser(user): Promise<any> {
        const found = await this.userRepo.findOne({
            where: {id: user.id},
            relations: ["ownedOrgs", "organizations"],
        });

        return {owned: found.ownedOrgs, member: found.organizations};
    }

    async findOne(id: string | number): Promise<Organization> {
        return await this.orgRepo.findOne(id, {
            relations: ["projects", "owner", "members"],
        });
    }

    async create(body: Partial<Organization>, owner: User): Promise<Organization> {
        const org = {...body, owner};
        try {
            return await this.orgRepo.save(org);
        } catch (e) {
            throw new NotAcceptableException();
        }
    }

    async addMember(id: string, ownerId: string, memberId: string): Promise<Organization> {
        const org = await this.orgRepo.findOne({
            where: {owner: ownerId, id},
            relations: ["members"],
        });
        const newMember = await this.userRepo.findOne(memberId);
        org.members.push(newMember);
        return await this.orgRepo.save(org);
    }

    async removeMember(id: string, ownerId: string, memberId: string): Promise<Organization> {
        const org = await this.orgRepo.findOne({
            where: {
                owner: ownerId,
                id,
            },
            relations: ["members"],
        });
        org.members = org.members.filter((member) => member.id !== memberId);
        return await this.orgRepo.save(org);
    }

    async update(id: number, body: Organization): Promise<Organization> {
        delete body.id;
        await this.orgRepo.update(id, body);
        return await this.findOne(id);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.orgRepo.delete(id);
    }
}
