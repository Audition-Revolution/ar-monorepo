import { Test, TestingModule } from "@nestjs/testing";
import { AuditionController } from "../src/modules/organization/features/project/features/audition/audition.controller";

describe("Audition Controller", () => {
  let controller: AuditionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditionController],
    }).compile();

    controller = module.get<AuditionController>(AuditionController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
