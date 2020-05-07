import * as dotenv from "dotenv";

dotenv.config();
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function getBaseUrl() {
    return process.env.NODE_ENV !== "production" ? "http://localhost:3001" : "https://app.auditionrevolution.com";
}

function getServerUrl() {
    return process.env.NODE_ENV !== "production" ? "http://localhost:3000" : "https://www.auditionrevolution.com";
}

export function newOrganizationEmail(user, company) {
    const html = `
        <p>New Company is interested in registering for Audition Revolution</p>
        <p>An account was created by the following user:</p>
        <ul>
            <li>Name: ${user.firstName} ${user.lastName}</li>
            <li>Email: ${user.email}</li>
            <li>Location: ${user.city} ${user.state}</li>
        </ul>
        <p>Company Information</p>
        <ul>
            <li>Name: ${company.name}</li>
            <li>Type: ${company.type}</li>
            <li>EIN: ${company.ein}</li>
        </ul>
    `;
    if (process.env.NODE_ENV !== "production") {
        const msg = {
            to: "king0120@gmail.com",
            from: "support@auditionrevolution.com",
            subject: `New Organization Registered`,
            html,
        };
        sgMail.send(msg);
    } else {
        const msg = {
            to: "jarrad@auditionrevolution",
            cc: ["jamie@auditionrevolution.com", "megan@auditionrevolution.com"],
            from: "support@auditionrevolution.com",
            subject: `New Organization Registered`,
            html,
        };
        sgMail.send(msg);
    }
}

export function rejectionEmail(email, project) {
    const html = `
        <h1 style="color: indianred">Ya didn't make it</h1>
        <p>Good Luck Next Time!</p>
    `;
    if (process.env.NODE_ENV !== "production") {

        const msg = {
            to: "king0120@gmail.com",
            from: "support@auditionrevolution.com",
            subject: `Audition Results for ${project.name}`,
            html,
        };
        sgMail.send(msg);
    } else {

        const msg = {
            to: email,
            from: "support@auditionrevolution.com",
            subject: `Audition Results for ${project.name}`,
            html,
        };
        sgMail.send(msg);
    }

}

export async function sendUserRegistrationEmail(email, name, id) {
    const html = `
        <h1>Welcome to Audition Revolution, ${name}!</h1>
        <p>To verify your account, click the link below.</p>

        <a href="${getServerUrl()}/auth/verify/${id}">Account Verification</a>

        <p>Not ${name}? No worries - just disregard this email.</p>
        <p>Sincerely,</p>
        <p>Audition Revolution Team</p>
    `;
    if (process.env.NODE_ENV !== "production") {

        const msg = {
            to: "king0120@gmail.com",
            from: "support@auditionrevolution.com",
            subject: "Audition Revolution Account Verification",
            html,
        };
        await sgMail.send(msg);
    } else {

        const msg = {
            to: email,
            from: "support@auditionrevolution.com",
            subject: "Audition Revolution Account Verification",
            html,
        };
        await sgMail.send(msg);
    }
    console.log("finish user registration");
}

export default function sendEmail(email, token) {
    const url = getBaseUrl();

    const fullUrl = `${url}/passwordReset/${token}`;
    const html = `
        <h1>Audition Revolution Password Reset</h1>
        <p>Please click the link below in order to reset your password.</p>
        <a href="${fullUrl}">${fullUrl}</a>
        <p>Did you not request a password reset? If so, please contact us at support@auditionrevolution.com</p>
        <p>Sincerely,</p>
        <p>Audition Revolution Team</p>
    `;

    let msg = {} as any;
    if (process.env.NODE_ENV !== "production") {
        msg = {
            to: "king0120@gmail.com",
            from: "support@auditionrevolution.com",
            subject: "Audition Revolution Password Reset",
            html,
        };
    } else {
        msg = {
            to: email,
            from: "support@auditionrevolution.com",
            subject: "Audition Revolution Password Reset",
            html,
        };
    }
    console.log("Sending password reset");
    return sgMail.send(msg).then(() => {
        console.log(`mail to ${email} is sent`);
    }).catch(error => {
        const {message, code, response} = error;
        console.error(`${error.code} :${error.message}`);
    });

}

export function orgCreateEmail(email, org) {
    const html = `
        <h1 style="color: indianred">New Org Created!</h1>
        <p>An organiziation called ${org.name} was just created. Please contact ${org.owner.displayName} at ${org.owner.email} for onboarding</p>
    `;
    if (process.env.NODE_ENV !== "production") {

        const msg = {
            to: "king0120@gmail.com",
            from: "support@auditionrevolution.com",
            subject: "New Organization Created",
            html,
        };
        sgMail.send(msg);
    } else {

        const msg = {
            to: email,
            from: "support@auditionrevolution.com",
            subject: "New Organization Created",
            html,
        };
        sgMail.send(msg);
    }

}

export async function auditionInvite(email, project, audition, responseCode) {
    const url = getBaseUrl();
    const fullUrl = `${url}/auditionResponse?project=${project}&audition=${audition.id}&responseCode=${responseCode}&email=${email}`;
    const html = `
        <h1 style="color: indianred">Confirm an Audition</h1>
        <p>Click <a href="${fullUrl}">here</a> to respond to your audition</p>
    `;
    if (process.env.NODE_ENV !== "production") {

        const msg = {
            to: "king0120@gmail.com",
            from: "support@auditionrevolution.com",
            subject: "Respond to Audition",
            html,
        };
        await sgMail.send(msg);
        return "success";
    } else {

        const msg = {
            to: email,
            from: "support@auditionrevolution.com",
            subject: "Respond to Audition",
            html,
        };
        await sgMail.send(msg);
        return "success";
    }

}
