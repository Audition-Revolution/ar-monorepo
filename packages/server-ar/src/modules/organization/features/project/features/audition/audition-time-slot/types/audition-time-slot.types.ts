import {ArgsType, Field, InputType, Int} from "type-graphql";
import {AuditionTimeSlot} from "../AuditionTimeSlot.entity";

@ArgsType()
export class GetTimeSlotDTO {
    @Field()
    organizationId: string;
}

@InputType()
export class DeleteTimeSlotDTO implements Partial<AuditionTimeSlot> {
    @Field()
    id: string;
    @Field({nullable: true})
    auditionId: string;
}

@InputType()
export class CreateTimeSlotDTO implements Partial<AuditionTimeSlot> {
    @Field()
    startTime: Date;
    @Field()
    endTime: Date;
    @Field({nullable: true})
    auditionId: string;
    @Field(type => Int, {nullable: true})
    capacity: number;
}
