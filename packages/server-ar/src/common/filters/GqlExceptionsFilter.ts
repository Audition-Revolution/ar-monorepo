import {GqlArgumentsHost, GqlExceptionFilter} from "@nestjs/graphql";
import {ArgumentsHost, Catch, HttpException} from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements GqlExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        return exception;
    }
}
