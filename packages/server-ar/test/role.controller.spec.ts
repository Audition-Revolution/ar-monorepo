import { Test, TestingModule } from "@nestjs/testing";
import { RoleController } from "../src/modules/organization/features/project/features/role/role.controller";

describe("Role Controller", () => {
  let controller: RoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
    }).compile();

    controller = module.get<RoleController>(RoleController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
