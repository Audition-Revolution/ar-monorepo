import * as csv from "csv-parser";
import * as fs from "fs";
import { resolve } from "path";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { UserService } from "../modules/user/user.service";
import { User, Gender } from "../modules/user/User.entity";
import { ActorTagService } from "../modules/user/features/actor-tag/ActorTag.service";
import { BreakdownService } from "../modules/common/breakdown/breakdown.service";

interface DataResponse {
  "First/Middle": string;
  "Last Name": string;
  "Primary Phone": string;
  "Email Address": string;
  "AEA": string;
  "Ethnicity": string;
  "Gender": string;
  "Musical Theatre?": string;
  "Instrument?": string;
  "T.O. Vet?": string;
  "Readiness": string;
}

async function main() {
  const app = await NestFactory.create(AppModule);
  const userService = app.get(UserService);
  const tagService = app.get(ActorTagService);
  const breakdownService = app.get(BreakdownService)
  const notAdded = [];
  const jamie = await userService.findByEmail("king0120@gmail.com");
  const clifton = await userService.findByEmail("cliftonguterman@gmail.com");
  async function addTagsForUser(user, data) {
    tagService.createTag({
      owner: clifton.id,
      for: user.id,
      tag: data.Readiness,
    });
    if (data["T.O. Vet?"].length > 0) {
      tagService.createTag({
        owner: clifton.id,
        for: user.id,
        tag: "T.O. Vet",
      });
    }
    tagService.createTag({
      owner: clifton.id,
      for: user.id,
      tag: "My Talent",
    });
    tagService.createTag({
      owner: jamie.id,
      for: user.id,
      tag: "Clifton Talent",
    });
  }
  async function addBreakdown(user, data){
    const breakdown = {} as any;
    breakdown.gender = [data.Gender === "male" ? "Male" : "Female"];
    // African American
    // Asian
    // Caucasian
    // Hispanic
    // Latino
    // Native American
    // Alaskan Native
    // Hawaiian
    // Middle Eastern
    // North African
    // Multi-Cultural
    switch (data.Ethnicity.toLowerCase()) {
      case "arabic":
      breakdown.ethnicity = ["Middle Eastern"];
      case "asian":
        breakdown.ethnicity = ["Asian"];
      case "black":
        breakdown.ethnicity = ["African American"];
      case "indian":
        breakdown.ethnicity = ["Indian"];
      case "latinx":
        breakdown.ethnicity = ["Latino"];
      case "other":
        breakdown.ethnicity = [];
      case "white":
        breakdown.ethnicity = ["Caucasian"];
    }
    await breakdownService.addUserBreakdown(breakdown, user)
  }
  async function createNewUser(data: DataResponse) {
    const user = new User();
    user.firstName = data["First/Middle"];
    user.lastName = data["Last Name"];
    user.displayName = user.firstName + " " + user.lastName;
    user.email = data["Email Address"].trim();
    user.gender = data.Gender === "male" ? Gender.Male : Gender.Female;
    user.phoneNumber = data["Primary Phone"];
    user.password = "0";
    user.salt = "0";
    user.ghostAccount = true;
    user.importSourceEmails = ["cliftonguterman@gmail.com", "king0120@gmail.com"];

    try {
      const saved = await userService.create(user);
      console.log("Saved ", saved.displayName);
      await addTagsForUser(saved, data);
      await addBreakdown(saved, data);
    } catch (err) {
      throw err;
    }
  }

  fs
    .createReadStream(resolve(__dirname, "./cgActors.csv"))
    .pipe(csv())
    .on("data", data => {
      if (!data["Email Address"]) {
        return;
      }
      return userService.findByEmail(data["Email Address"].trim()).then(async user => {
        if (!user) {
          notAdded.push(data);
          await createNewUser(data);
        } else {
          console.log(user.id);
          await addTagsForUser(user, data);
        }
        console.log(notAdded.length + " new actors");
      });
    })
    .on("end", () => {
      console.log("finished");
    });

}

main();
