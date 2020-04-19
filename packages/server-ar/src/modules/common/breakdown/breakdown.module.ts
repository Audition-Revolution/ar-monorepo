import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BreakdownService} from ".//breakdown.service";
import {BreakdownAttribute} from "./BreakdownAttribute.entity";

@Module({
    imports: [TypeOrmModule.forFeature([BreakdownAttribute])],
    providers: [BreakdownService],
    controllers: [],
})
export class BreakdownModule {
}
