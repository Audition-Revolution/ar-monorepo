import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {S3Service} from "./s3.service";
import {UserImage} from "../user/UserImage.entity";
import {AuditionCollateral} from "../organization/features/project/features/audition/AuditionCollateral.entity";

const DBImports = TypeOrmModule.forFeature([UserImage, AuditionCollateral]);
@Module({
    imports: [DBImports],
    providers: [S3Service],
    exports: [S3Service, DBImports],
})
export class S3Module {
}
