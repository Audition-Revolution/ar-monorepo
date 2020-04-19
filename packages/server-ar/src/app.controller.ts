import {Body, Controller, Get, Next, Post, Render, Req, Res} from "@nestjs/common";
import {twiml} from "twilio";
import {format} from "url";

@Controller() // Matches "/"
export class GenericController {
    @Get("/__coverage__")
    coverage(@Res() res) {
        const coverage = (global as any).__coverage__;
        if (coverage) {
            // add method "GET /__coverage__" and response with JSON
            res.send({coverage});
        }
    }

    @Get("/")
    @Render("index")
    root() {
        return {message: "Hello world"};
    }

    @Get("/app") // Matches "*" on all methods GET, POST...
    goToApp(@Res() res, @Req() req, @Next() next) {
        if (process.env.NODE_ENV !== "production") {
            return res.redirect("http://localhost:3001");
        }
        return res.redirect("https://app.auditionrevolution.com");
    }

    @Get("*") // Matches "*" on all methods GET, POST...
    genericFunction(@Res() res, @Req() req, @Next() next) {
        if (process.env.NODE_ENV !== "production") {
            if (req.path === "/graphql") {
                return next();
            }
            return res.redirect(format({
                pathname: "http://localhost:3001" + req.path,
                query: req.query,
            }));
        }

        return res.redirect(format({
            pathname: "https://app.auditionrevolution.com" + req.path,
            query: req.query,
        }));
    }

    @Post("/sms")
    recieveSms(@Req() req, @Res() res) {
        const {MessagingResponse} = twiml;
        const response = new MessagingResponse();
        response.message("The Robots are coming! Head for the hills!");

        res.writeHead(200, {"Content-Type": "text/xml"});
        res.end(response.toString());
    }

    @Post("/emailEvent")
    async emailEvent(@Req() req, @Res() res, @Body() body) {
        body.map((event => {
            if (event.event === "delivered") {
                // const user = await this.userService.findByEmail(event.email);
                // console.log(user);
            }
        }));
        res.send("success");
    }
}
