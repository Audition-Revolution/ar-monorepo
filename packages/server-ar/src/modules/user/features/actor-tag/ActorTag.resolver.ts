import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {ActorTagService} from "./ActorTag.service";
import {UseGuards} from "@nestjs/common";
import {GqlAuthGuard} from "../../../../common/guards/GqlAuthGuard";
import {ActorTag} from "./ActorTag.entity";
import {Field, InputType, ObjectType} from "type-graphql";
import {CurrentUser} from "../../../../common/decorators/CurrentUser.decorator";

@InputType()
export class CreateTagDTO {
    @Field()
    tag: string;
    @Field()
    for: string;
}

@ObjectType()
export class Tags {
    @Field(() => [String], {nullable: true})
    tags: string[];
}

@Resolver(of => ActorTag)
export class ActorTagResolver {
    constructor(
        private readonly actorTagService: ActorTagService,
    ) {
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => Tags)
    async getDistinctTags(@CurrentUser() user) {
        const tags = await this.actorTagService.findDistinctTags(user.id);
        return {tags};
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [ActorTag])
    async getTagsForOwner(@CurrentUser() user) {
        const tags = await this.actorTagService.findTagsForOwner(user.id);
        return tags;
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [ActorTag])
    async getTagsForTagsPage(@CurrentUser() user) {
        const tags = await this.actorTagService.findTagsForOwner(user.id, true);
        return tags;
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => Tags)
    async getTagsForActor(@Args("id") id: string, @CurrentUser() user) {
        const tags = await this.actorTagService.getTagsForUser(user.id, id);
        return {tags};
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async createTag(@Args("input") input: CreateTagDTO, @CurrentUser() user) {
        await this.actorTagService.createTag({
            owner: user.id,
            ...input,
        });
        return true;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async deleteTag(@Args("input") input: CreateTagDTO, @CurrentUser() user) {
        await this.actorTagService.deleteTag({
            owner: user.id,
            ...input,
        });
        return true;
    }

    //
    // @UseGuards(GqlAuthGuard)
    // @Mutation(() => Boolean, {nullable: true})
    // async removeNote(@Args('id') id: string, @CurrentUser() user) {
    //     const newNote = await this.actorTagService.delete(id);
    //     return newNote;
    // }
}
