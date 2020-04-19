import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {ActorNoteService} from "./ActorNote.service";
import {UseGuards} from "@nestjs/common";
import {GqlAuthGuard} from "../../../../common/guards/GqlAuthGuard";
import {CurrentUser} from "../../../../common/decorators/CurrentUser.decorator";
import {GetNotesDTO} from "./types/GetNote.dto";
import {CreateNoteDTO} from "./types/CreateNote.dto";
import {ActorNote} from "./ActorNote.entity";

@Resolver(of => ActorNote)
export class ActorNoteResolver {
    constructor(
        private readonly actorNoteService: ActorNoteService,
    ) {
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [ActorNote])
    async getAllNotes(@CurrentUser() user) {
        return await this.actorNoteService.findNotesForActor(user.id);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [ActorNote])
    async getNotes(@Args() {actorId}: GetNotesDTO, @CurrentUser() user) {
        return await this.actorNoteService.findNotesForActor(user.id, actorId);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => ActorNote)
    async addNote(@Args("input") input: CreateNoteDTO, @CurrentUser() user) {
        input.owner = user.id;
        const newNote = await this.actorNoteService.createNote(input);
        return newNote;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async removeNote(@Args("id") id: string, @CurrentUser() user) {
        const newNote = await this.actorNoteService.delete(id);
        return newNote;
    }
}
