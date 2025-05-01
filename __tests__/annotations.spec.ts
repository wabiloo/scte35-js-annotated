import { expect } from "chai";
import { ISpliceInsertEvent, SpliceCommandType } from "../src/ISCTE35";
import * as descriptors from "../src/descriptors";
import { SCTE35 } from "../src/scte35";

describe("SCTE35 Annotations", () => {
    const scte35: SCTE35 = new SCTE35();

    describe("Test Payload 1 (Base64)", () => {
        // /DBGAAET8J+pAP/wBQb+AAAAAAAwAi5DVUVJQAErgX+/CR9TSUdOQUw6OGlTdzllUWlGVndBQUFBQUFBQUJCQT09NwMDaJ6RZQ==
        const base64 =
            "/DBGAAET8J+pAP/wBQb+AAAAAAAwAi5DVUVJQAErgX+/CR9TSUdOQUw6OGlTdzllUWlGVndBQUFBQUFBQUJCQT09NwMDaJ6RZQ==";
        const spliceInfo = scte35.parseFromB64(base64);

        it("should have correct splice command annotations", () => {
            expect(spliceInfo.spliceCommandType).to.eq(SpliceCommandType.TIME_SIGNAL); // Base value 6
            expect(spliceInfo.spliceCommandType_name).to.eq("time_signal");
        });
    });

    describe("Test Payload 2 (Hex)", () => {
        // fc3046000113f09fa900fff00506fe000000000030022e4355454940012b817fbf091f5349474e414c3a386953773965516946567741414141414141414242413d3d370303689e9165
        const hex =
            "fc3046000113f09fa900fff00506fe000000000030022e4355454940012b817fbf091f5349474e414c3a386953773965516946567741414141414141414242413d3d370303689e9165";
        const spliceInfo = scte35.parseFromHex(hex);

        it("should have correct splice command annotations", () => {
            expect(spliceInfo.spliceCommandType).to.eq(SpliceCommandType.TIME_SIGNAL); // Base value 6
            expect(spliceInfo.spliceCommandType_name).to.eq("time_signal");
        });

        it("should have correct segmentation descriptor annotations", () => {
            expect(spliceInfo.descriptors).to.not.equal(undefined);
            if (spliceInfo.descriptors && spliceInfo.descriptors.length > 0) {
                const segDesc = spliceInfo.descriptors[0] as descriptors.ISegmentationDescriptor;
                expect(segDesc.spliceDescriptorTag).to.eq(2);
                expect(segDesc.spliceDescriptorTag_name).to.eq("Segmentation Descriptor");

                expect(segDesc.segmentationTypeId).to.eq(55); // Base value 0x37
                expect(segDesc.segmentationTypeId_name).to.eq("Distributor Placement Opportunity End");
                expect(segDesc.segmentationTypeId_hex).to.eq("0x37");

                expect(segDesc.segmentationUpidType).to.eq(9); // Base value 0x09
                expect(segDesc.segmentationUpidType_name).to.eq("CableLabs Content Identifier");
                expect(segDesc.segmentationUpidType_hex).to.eq("0x09");

                expect(segDesc.segmentationUpid).to.be.instanceOf(Uint8Array);
                expect(segDesc.segmentationUpid_ascii).to.eq("SIGNAL:8iSw9eQiFVwAAAAAAAABBA==");
                expect(segDesc.segmentationUpid_hex).to.eq("0x5349474e414c3a386953773965516946567741414141414141414242413d3d");
            }
        });
    });

    describe("Test Payload 3 (Base64 - Splice Insert)", () => {
        // /DAlAAAAAAAAAP/wFAUAAqbVf+/+AAAAAH4AUmXAAAAAAAAAdIQsGg==
        const base64 = "/DAlAAAAAAAAAP/wFAUAAqbVf+/+AAAAAH4AUmXAAAAAAAAAdIQsGg==";
        const spliceInfo = scte35.parseFromB64(base64);

        it("should have correct splice command annotations", () => {
            expect(spliceInfo.spliceCommandType).to.eq(SpliceCommandType.SPLICE_INSERT); // Base value 5
            expect(spliceInfo.spliceCommandType_name).to.eq("splice_insert");
        });

        it("should have correct break duration annotations", () => {
            const spliceCmd = spliceInfo.spliceCommand as ISpliceInsertEvent;
            expect(spliceCmd.breakDuration?.duration).to.eql(5400000);
            expect(spliceCmd.breakDuration?.duration_hms).to.eq("00:01:00.000");
            expect(spliceCmd.breakDuration?.duration_s).to.eq(60);
        });
    });

    describe("Test Payload 4 (Legacy Base64 - Time Signal)", () => {
        // /DA6AAAAAAAAAP///wb+GIZQCAAkAiJDVUVJAAv9L3//AAFeMHAMDkRJU0M2NzQ5NjNfOTk4MAEBsXXbjg
        const base64 = "/DA6AAAAAAAAAP///wb+GIZQCAAkAiJDVUVJAAv9L3//AAFeMHAMDkRJU0M2NzQ5NjNfOTk4MAEBsXXbjg";
        const spliceInfo = scte35.parseFromB64(base64);

        it("should have correct splice command annotations", () => {
            expect(spliceInfo.spliceCommandType).to.eq(SpliceCommandType.TIME_SIGNAL); // Base value 6
            expect(spliceInfo.spliceCommandType_name).to.eq("time_signal");
        });

        it("should have correct segmentation descriptor annotations", () => {
            expect(spliceInfo.descriptors).to.not.equal(undefined);
            if (spliceInfo.descriptors && spliceInfo.descriptors.length > 0) {
                const segDesc = spliceInfo.descriptors[0] as descriptors.ISegmentationDescriptor;
                expect(segDesc.segmentationDuration).to.eq(22950000);
                expect(segDesc.segmentationDuration_hms).to.eq("00:04:15.000");
                expect(segDesc.segmentationDuration_s).to.eq(255);

                expect(segDesc.segmentationTypeId).to.eq(48); // Base value 0x30
                expect(segDesc.segmentationTypeId_name).to.eq("Provider Advertisement Start");
                expect(segDesc.segmentationTypeId_hex).to.eq("0x30");
            }
        });
    });

    describe("Test Payload 5 (Legacy Base64 - Splice Insert)", () => {
        // /DAxAAAAAAAAAP///wUAhcJPf+/+zBS4Ln4AUmXAAAAAAAAMAQpDVUVJAJ8wNDgq0FP4ig
        const base64 = "/DAxAAAAAAAAAP///wUAhcJPf+/+zBS4Ln4AUmXAAAAAAAAMAQpDVUVJAJ8wNDgq0FP4ig";
        const spliceInfo = scte35.parseFromB64(base64);

        it("should have correct splice command annotations", () => {
            expect(spliceInfo.spliceCommandType).to.eq(SpliceCommandType.SPLICE_INSERT); // Base value 5
            expect(spliceInfo.spliceCommandType_name).to.eq("splice_insert");
        });

        it("should have correct break duration annotations", () => {
            const spliceCmd = spliceInfo.spliceCommand as ISpliceInsertEvent;
            expect(spliceCmd.breakDuration?.duration).to.equal(5400000);
            expect(spliceCmd.breakDuration?.duration_hms).to.eq("00:01:00.000");
            expect(spliceCmd.breakDuration?.duration_s).to.eq(60);
        });
    });

     describe("Test Payload 6 (Base64 - Non-Printable UPID)", () => {
        // /DBIAAAAAAAA///wBQb+ek2ItgAyAhdDVUVJSAAAGH+fCAgAAAAALMvDRBEAAAIXQ1VFSUgAABl/nwgIAAAAACyk26AQAACZcuND
        const base64 = "/DBIAAAAAAAA///wBQb+ek2ItgAyAhdDVUVJSAAAGH+fCAgAAAAALMvDRBEAAAIXQ1VFSUgAABl/nwgIAAAAACyk26AQAACZcuND";
        const spliceInfo = scte35.parseFromB64(base64);

        it("should have correct annotations for descriptor 1", () => {
            if (spliceInfo.descriptors && spliceInfo.descriptors.length > 0) {
                const segDesc = spliceInfo.descriptors[0] as descriptors.ISegmentationDescriptor;
                expect(segDesc.segmentationUpidType).to.eq(8); // Base value 0x08
                expect(segDesc.segmentationUpidType_name).to.eq("AiringID (formerly Turner ID)");
                expect(segDesc.segmentationUpidType_hex).to.eq("0x08");

                expect(segDesc.segmentationUpid).to.be.instanceOf(Uint8Array);
                expect(segDesc.segmentationUpid_ascii).to.eq("????,??D");
                expect(segDesc.segmentationUpid_hex).to.eq("0x000000002ccbc344");

                expect(segDesc.segmentationTypeId).to.eq(17); // Base value 0x11
                expect(segDesc.segmentationTypeId_name).to.eq("Program End");
                expect(segDesc.segmentationTypeId_hex).to.eq("0x11");
            }
        });

        it("should have correct annotations for descriptor 2", () => {
            if (spliceInfo.descriptors && spliceInfo.descriptors.length > 1) {
                 const segDesc = spliceInfo.descriptors[1] as descriptors.ISegmentationDescriptor;
                expect(segDesc.segmentationUpidType).to.eq(8); // Base value 0x08
                expect(segDesc.segmentationUpidType_name).to.eq("AiringID (formerly Turner ID)");
                expect(segDesc.segmentationUpidType_hex).to.eq("0x08");

                expect(segDesc.segmentationUpid).to.be.instanceOf(Uint8Array);
                expect(segDesc.segmentationUpid_ascii).to.eq("????,???");
                expect(segDesc.segmentationUpid_hex).to.eq("0x000000002ca4dba0");

                expect(segDesc.segmentationTypeId).to.eq(16); // Base value 0x10
                expect(segDesc.segmentationTypeId_name).to.eq("Program Start");
                expect(segDesc.segmentationTypeId_hex).to.eq("0x10");
            }
        });
    });
}); 