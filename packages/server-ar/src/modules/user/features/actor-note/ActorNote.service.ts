import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ActorNote} from "./ActorNote.entity";
import {Repository} from "typeorm";
import {CreateNoteDTO} from "./types/CreateNote.dto";

@Injectable()
export class ActorNoteService {
    constructor(
        @InjectRepository(ActorNote)
        private readonly actorNoteRepo: Repository<ActorNote>,
    ) {
    }

    async findNotesForActor(ownerId: string, actorId?: string): Promise<ActorNote[]> {
        const where = actorId ? {
            ownerId,
            forId: actorId,
        } : {ownerId};
        const notes = await this.actorNoteRepo.find({
            relations: ["owner", "for", "audition", "for.profilePicture"],
            where,
            take: where ? 10 : undefined,
        });

        return notes;
    }

    async createNote(newNote: CreateNoteDTO): Promise<ActorNote> {
        if (!newNote.audition) {
            newNote.audition = null;
        }
        const toSave = {
            text: newNote.text,
            forId: newNote.for,
            auditionId: newNote.audition,
            ownerId: newNote.owner,
        };
        return await this.actorNoteRepo.save(toSave);
    }

    async delete(noteId: string): Promise<any> {
        await this.actorNoteRepo.delete(noteId);
        return true;
    }
}
