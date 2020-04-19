import { Test, TestingModule } from "@nestjs/testing";
import { OrganizationService } from "../src/modules/organization/organization.service";

describe("OrganizationService", () => {
  let service: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationService],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
