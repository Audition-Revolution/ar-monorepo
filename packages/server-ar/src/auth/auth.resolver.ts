import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {UseGuards} from "@nestjs/common";
import {ArgsType, Field, ObjectType} from "type-graphql";
import {GqlAuthGuard} from "../common/guards/GqlAuthGuard";
import {AuthService} from "./auth.service";
import {CurrentUser} from "../common/decorators/CurrentUser.decorator";
import {User} from "../modules/user/User.entity";

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;
    @Field()
    userId: string;
    @Field({nullable: true})
    displayName: string;
}

@ArgsType()
export class LoginDTO {
    @Field()
    email: string;
    @Field()
    password: string;
}

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
    ) {
    }

    @Mutation(() => LoginResponse)
    async login(
        @Args() {email, password}: LoginDTO,
    ): Promise<LoginResponse> {
        try {
            return await this.authService.login({email, password});
        } catch (e) {
            throw new Error("Invalid Email or Password Provided");
        }
    }

    @Query(() => User)
    @UseGuards(GqlAuthGuard)
    async tokenCheck(@CurrentUser() currentUser: User) {
        if (currentUser) {
            const {password, salt, ...user} = currentUser;
            return user;
        }
    }
}
