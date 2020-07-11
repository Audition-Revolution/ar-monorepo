import * as fs from "fs";
import csv from "csv-parser";
import { resolve } from "path";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { UserService } from "../modules/user/user.service";
import { ActorTagService } from "../modules/user/features/actor-tag/ActorTag.service";
import { ActorNoteService } from "../modules/user/features/actor-note/ActorNote.service";
import { ProjectService } from "../modules/organization/features/project/project.service";
import { ProjectModule } from "../modules/organization/features/project/project.module";

interface DataResponse {
  "First": string;
  "Last": string;
  "Email": string;
  "City": string;
  "State": string;
  "Phone #": string;
  "Gender": string;
  "Ethnicity": string;
  "Age Range": string;
  "Unions": string;
  "Vocal Range": string;
  "Alumni Tag": string;
  "Notes": string;
}

// async function main() {
//   const app = await NestFactory.create(AppModule);
//   const userService = app.get(UserService);
//   const tagService = app.get(ActorTagService);
//   const noteService = app.get(ActorNoteService);
//   const breakdownService = app.get(BreakdownService);
//   const notAdded = [];
//   const jamie = await userService.findByEmail("king0120@gmail.com");
//   const clifton = await userService.findByEmail("rschult@emory.edu");
//   async function addTagsForUser(user, data) {
//     if (data["Alumni Tag"].length > 0) {
//       await   tagService.createTag({
//         owner: clifton.id,
//         for: user.id,
//         tag: "Alumni Tag",
//       });
//     }
//     await  tagService.createTag({
//       owner: clifton.id,
//       for: user.id,
//       tag: "My Talent",
//     });
//     await tagService.createTag({
//       owner: jamie.id,
//       for: user.id,
//       tag: "Emory Talent",
//     });
//   }
//   async function addBreakdown(user, data) {
//     const breakdown = {} as any;
//     breakdown.gender = [data.Gender];
//     breakdown.unions = data.Unions.split(", ");
//     breakdown.ethnicity = data.Ethnicity.split(", ");
//     breakdown.ageRange = data["Age Range"].split(", ");
//     breakdown.vocalRange = data["Vocal Range"].split(", ");
//     await breakdownService.addUserBreakdown(breakdown, user);
//   }
//   async function createNewUser(data: DataResponse) {
//     const user = new User();
//     user.firstName = data.First;
//     user.lastName = data.Last;
//     user.displayName = user.firstName + " " + user.lastName;
//     user.city = data.City;
//     user.state = data.State;
//     user.email = data.Email.trim();
//     user.gender = data.Gender as any;
//     user.phoneNumber = data["Phone #"].replace(/-/g, "");
//     user.password = "0";
//     user.salt = "0";
//     user.ghostAccount = true;
//     user.importSourceEmails = ["rschult@emory.edu", "king0120@gmail.com"];

//     try {
//       const saved = await userService.create(user);
//       console.log("Saved ", saved.displayName);
//       await addTagsForUser(saved, data);
//       await addBreakdown(saved, data);
//     } catch (err) {
//       throw err;
//     }
//   }

//   fs
//     .createReadStream(resolve(__dirname, "./theatreEm.csv"))
//     .pipe(csv())
//     .on("data", data => {
//       if (!data.Email) {
//         return;
//       }
//       return userService.findByEmail(data.Email.trim()).then(async user => {
//         if (!user) {
//           console.log("new user");
//           notAdded.push(data);
//           await createNewUser(data);
//         } else {
//           console.log("existing user", user.id);
//           await addTagsForUser(user, data);
//           try {
//             console.log(user, data)
//             // await addBreakdown(user, data);
//           } catch (err) {
//             console.error('Can not add breakdown')
//           }
//         }
//         console.log(notAdded.length + " new actors");
//       });
//     })
//     .on("end", () => {
//       console.log("finished");
//     });

// }

// main();
async function findMissing() {
  const app = await NestFactory.create(AppModule);
  const projectService = app.get(ProjectModule);
  const userService = app.get(UserService);
  const noteService = app.get(ActorNoteService);
  const notAdded = [];
  const totalUsers = [];
  let rows = 0;
  const found = 0;
  const tagService = app.get(ActorTagService);
  const jamie = await userService.findByEmail("king0120@gmail.com");
  const clifton = await userService.findByEmail("rschult@emory.edu");
  fs
      .createReadStream(resolve(__dirname, "./theatreEm.csv"))
      .pipe(csv())
      .on("data", async (data: DataResponse) => {
        rows += 1;
        if (!data.Email) {
          return;
        }
        await userService.findByEmail(data.Email.trim()).then(async user => {
          if (data.Notes) {
            noteService.createNote({
              for: user.id,
              owner: clifton.id,
              text: data.Notes,
            });
          }

          try {
            totalUsers.push(user.id);
            // if (!user.importSourceEmails.includes("rschult@emory.edu")) {
            //   console.log(user.importSourceEmails);
            //   user.importSourceEmails.push("rschult@emory.edu");
            //   userService.update(user.id, user);
            // }
          } catch (err) {
            console.log("CATCH");
          }

        });
      })
      .on("end", () => {
        console.log("finished");
      });
}

findMissing();
