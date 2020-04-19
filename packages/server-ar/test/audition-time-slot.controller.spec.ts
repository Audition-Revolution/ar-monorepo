import {Test, TestingModule} from "@nestjs/testing";
import {
    AuditionTimeSlotController,
} from "../src/modules/organization/features/project/features/audition/audition-time-slot/audition-time-slot.controller";

describe("AuditionTimeSlot Controller", () => {
    let controller: AuditionTimeSlotController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuditionTimeSlotController],
        }).compile();

        controller = module.get<AuditionTimeSlotController>(AuditionTimeSlotController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
