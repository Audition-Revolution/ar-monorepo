import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../modules/user/user.service";
import {LoginUserDto} from "./types/loginUser.dto";
import * as crypto from "crypto";
import sendEmail, {sendUserRegistrationEmail} from "../util/send_email";
import {User} from "../modules/user/User.entity";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {
    }

    public async login(user: LoginUserDto): Promise<any | { status: number }> {
        return this.validate(user).then((userData) => {
            if (userData.status) {
                throw new Error(userData);
            }
            delete userData.password;
            delete userData.salt;

            const payload = JSON.parse(JSON.stringify(userData));
            const accessToken = this.jwtService.sign(payload, {
                expiresIn: 36000,
            });
            return {
                accessToken,
                userId: payload.id,
                displayName: payload.displayName,
                status: 200,
            };
        });
    }

    public async register(user: Partial<User>): Promise<any> {
        try {
            return await this.userService.create(user);
        } catch (err) {
            throw new Error(err);
        }
    }

    public async verify(id) {
        return this.userService.update(id, {verified: true});
    }

    async createToken() {
        const user: any = {email: "test@email.com"};
        const accessToken = this.jwtService.sign(user);
        return {
            expiresIn: 24 * 60 * 60,
            accessToken,
        };
    }

    async validateUser(payload): Promise<any> {
        return await this.userService.findByEmail(payload.email);
    }

    async validate(userData: LoginUserDto): Promise<any> {

        const user = await this.userService.findByEmailPassword(userData.email);
        if (!user) {
            return {
                status: 401,
                message: "Could not find a user with that email/password combination",
            };
        }
        const passwordMatch = user.validPassword(userData.password);
        if (!passwordMatch) {
            return {
                status: 401,
                message: "Could not find a user with that email/password combination",
            };
        }
        const validUser = await this.userService.findByEmail(userData.email);
        return validUser;
    }

    sendPasswordReset = async (email: string) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(20, async (err, buf) => {
                try {
                    const token = buf.toString("hex");
                    const user = await this.userService.findByEmail(email);
                    if (!user) {
                        return reject("No User Found");
                    }
                    user.resetPasswordToken = token;
                    const expires = new Date();
                    expires.setHours(expires.getHours() + 1);
                    user.resetPasswordExpires = expires;
                    await this.userService.update(user.id, user);
                    console.log("Update succeed");
                    if (!user.verified) {
                        await sendUserRegistrationEmail(user.email, `${user.firstName} ${user.lastName}`, user.id);
                        console.log("Email Registration complete");
                    }
                    try {
                        await sendEmail(user.email, user.resetPasswordToken, user.resetPasswordExpires);
                        console.log("Password Reset complete");
                    } catch (err) {
                        throw Error("Email Send Unsuccessful");
                    }

                    return resolve("Success");
                } catch (err) {
                    return reject(err);
                }
            });
        });
    }

    setNewPassword = async (resetPasswordToken, resetPasswordExpires, newPassword) => {
        try {
            const user = await this.userService.setNewPassword(resetPasswordToken, resetPasswordExpires, newPassword);
            if (!user) {
                return {
                    message: "failure",
                };
            }
            return {
                message: "success",
            };
        } catch (err) {
            return {
                message: "error",
            };
        }

    }
}
