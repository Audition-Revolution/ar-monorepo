import { Module } from "@nestjs/common";
import { ActorNoteResolver } from "./ActorNote.resolver";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ActorNote} from "./ActorNote.entity";
import {ActorNoteService} from "./ActorNote.service";

const Entities = TypeOrmModule.forFeature([ActorNote]);
@Module({
    imports: [Entities],
    providers: [ActorNoteService, ActorNoteResolver],
})
export class ActorNoteModule {}
