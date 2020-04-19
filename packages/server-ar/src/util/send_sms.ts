import * as dotenv from "dotenv";
import * as twilio from "twilio";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

client.messages
    .create({
        body: `Hooray! We've got a way to text people using the new AR code now :)  - Jamie via AR`,
        from: "+14046202013",
        to: "+17065402896",
    });
