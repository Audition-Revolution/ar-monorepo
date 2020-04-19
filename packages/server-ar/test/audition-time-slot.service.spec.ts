import {Test, TestingModule} from "@nestjs/testing";
import {AuditionTimeSlotService} from "../src/modules/organization/features/project/features/audition/audition-time-slot/audition-time-slot.service";

describe("AuditionTimeSlotService", () => {
    let service: AuditionTimeSlotService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuditionTimeSlotService],
        }).compile();

        service = module.get<AuditionTimeSlotService>(AuditionTimeSlotService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
