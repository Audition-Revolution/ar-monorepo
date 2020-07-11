import * as dotenv from "dotenv";
dotenv.config();
import {NestFactory} from "@nestjs/core";
import {NestExpressApplication} from "@nestjs/platform-express";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {AppModule} from "./app.module";
import {ValidationPipe} from "@nestjs/common";
import {join} from "path";
import * as Sentry from "@sentry/node";
import {HttpExceptionFilter} from "./common/filters/GqlExceptionsFilter";

declare module NodeJS {
    interface Global {
        __coverage__: any;
    }
}

async function bootstrap() {
    try {
        const app = await NestFactory.create<NestExpressApplication>(AppModule);
        Sentry.init({dsn: "https://de8d7afb556c4bbdb7534f406c54aca7@sentry.io/3288030"});
        const options = new DocumentBuilder()
            .setTitle("AR Api")
            .setBasePath("api/v1")
            .build();

        app.enableCors();
        app.useGlobalFilters(new HttpExceptionFilter());
        app.useStaticAssets(join(__dirname, "..", "public"));
        app.setBaseViewsDir(join(__dirname, "..", "views"));
        app.setViewEngine("hbs");
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup("docs", app, document);
        app.useGlobalPipes(new ValidationPipe());
        await app.listen(process.env.PORT || 3000);
    } catch (err) {
        console.log(err)
        throw new Error("Error occured when bootstrapping");
    }
}

bootstrap();
