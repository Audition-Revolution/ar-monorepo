import * as fs from "fs";
import csv from "csv-parser";
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
  "Union": string;
  "Ethnicity": string;
  "Gender": string;
  "Musical Theatre Tag": string;
  "Instrument Tag": string;
  "T.O. Vet Tag": string;
  "Readiness Tags": string;
}

async function main() {
  const app = await NestFactory.create(AppModule);
  const userService = app.get(UserService);
  const tagService = app.get(ActorTagService);
  const breakdownService = app.get(BreakdownService);
  const notAdded = [];
  const jamie = await userService.findByEmail("king0120@gmail.com");
  const clifton = await userService.findByEmail("cliftonguterman@gmail.com");
  async function addTagsForUser(user, data) {
    await tagService.createTag({
      owner: clifton.id,
      for: user.id,
      tag: data["Readiness Tags"],
    });
    if (data["T.O. Vet Tag"].length > 0) {
      await   tagService.createTag({
        owner: clifton.id,
        for: user.id,
        tag: "T.O. Vet",
      });
    }
    if (data["Musical Theatre Tag"].length > 0) {
      await tagService.createTag({
        owner: clifton.id,
        for: user.id,
        tag: "Musical Theatre",
      });
    }
    if (data["Instrument Tag"].length > 0) {
      await tagService.createTag({
        owner: clifton.id,
        for: user.id,
        tag: "Instrument",
      });
    }
    await  tagService.createTag({
      owner: clifton.id,
      for: user.id,
      tag: "My Talent",
    });
    await tagService.createTag({
      owner: jamie.id,
      for: user.id,
      tag: "Clifton Talent",
    });
  }
  async function addBreakdown(user, data) {
    const breakdown = {} as any;
    breakdown.gender = [data.Gender === "male" ? "Male" : "Female"];
    breakdown.unions = [data.Union];
    breakdown.ethnicity = [data.Ethnicity];
    await breakdownService.addUserBreakdown(breakdown, user);
  }
  async function createNewUser(data: DataResponse) {
    const user = new User();
    user.firstName = data["First/Middle"];
    user.lastName = data["Last Name"];
    user.displayName = user.firstName + " " + user.lastName;
    user.email = data["Email Address"].trim();
    user.gender = data.Gender === "male" ? Gender.Male : Gender.Female;
    user.phoneNumber = data["Primary Phone"].replace(/-/g, "");
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
          console.log("new user");
          notAdded.push(data);
          await createNewUser(data);
        } else {
          console.log("existing user", user.id);
          await addTagsForUser(user, data);
        }
        console.log(notAdded.length + " new actors");
      });
    })
    .on("end", () => {
      console.log("finished");
    });

}

// main();
async function findMissing() {
  const app = await NestFactory.create(AppModule);
  const userService = app.get(UserService);
  const notAdded = [];
  const totalUsers = [];
  let rows = 0;
  let found = 0;
  const tagService = app.get(ActorTagService);
  const clifton = await userService.findByEmail("cliftonguterman@gmail.com");
  fs
      .createReadStream(resolve(__dirname, "./cgActors.csv"))
      .pipe(csv())
      .on("data", async (data) => {
        rows += 1;
        if (!data["Email Address"]) {
          return;
        }
        await userService.findByEmail(data["Email Address"].trim()).then(async user => {
          try {
            const tags = await tagService.getTagsForUser(clifton.id, user.id);
            // console.log(tags)
            if (tags.indexOf("My Talent") === -1) {

              console.log("NO TAG FOR", user.email);
            } else {
              found += 1;
              // console.log('tag found')
            }
            // console.log(tags)
          } catch (err) {
            console.log("CATCH")
          }

        });
        console.log(rows, found)
      })
      .on("end", () => {
        console.log("finished");
      });
}

findMissing();
