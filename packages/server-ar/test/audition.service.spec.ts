import { Test, TestingModule } from "@nestjs/testing";
import { AuditionService } from "../src/modules/organization/features/project/features/audition/audition.service";

describe("AuditionService", () => {
  let service: AuditionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditionService],
    }).compile();

    service = module.get<AuditionService>(AuditionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
