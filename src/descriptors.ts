/**
 * Copyright 2018 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or   implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as util from "./util";

export const enum SpliceDescriptorTag {
    AVAIL_DESCRIPTOR = 0x00,
    DTMF_DESCRIPTOR = 0x01,
    SEGMENTATION_DESCRIPTOR = 0x02,
    TIME_DESCRIPTOR = 0x03,
    // RESERVED 0x04 - 0xFF
}

// Mapping from SpliceDescriptorTag enum value to human-readable string
export const SpliceDescriptorTagMap: { [key in SpliceDescriptorTag]?: string } = {
    [SpliceDescriptorTag.AVAIL_DESCRIPTOR]: "Avail Descriptor",
    [SpliceDescriptorTag.DTMF_DESCRIPTOR]: "DTMF Descriptor",
    [SpliceDescriptorTag.SEGMENTATION_DESCRIPTOR]: "Segmentation Descriptor",
    [SpliceDescriptorTag.TIME_DESCRIPTOR]: "Time Descriptor",
};

export interface ISpliceDescriptorBase {
    spliceDescriptorTag: SpliceDescriptorTag;
    spliceDescriptorTag_name?: string; // Human-readable name
    descriptorLength: number;
    identifier: string; // CUEI
    _parsing_status?: string; // Renamed field
}

/**
 * 10.3.1 avail_descriptor()
 */
export interface IAvailDescriptor extends ISpliceDescriptorBase {
    providerAvailId: number;
}

/**
 * 10.3.2 DTMF_descriptor()
 */
export interface IDTMFDescriptor extends ISpliceDescriptorBase {
    preroll: number;
    dtmfCount: number;
    dtmfChar: string[];
}

/**
 * Table 21 segmentation_upid_type
 */
export const enum SegmentationUpidType {
    NOT_USED = 0x00,
    USER_DEFINED = 0x01,
    ISCI = 0x02,
    AD_ID = 0x03,
    UMID = 0x04,
    ISAN = 0x05, // Deprecated
    VISAN = 0x06,
    TID = 0x07,
    TI = 0x08,
    ADI = 0x09,
    EIDR = 0x0a,
    ATSC = 0x0b,
    MPU = 0x0c,
    MID = 0x0d,
    ADS = 0x0e,
    URI = 0x0f,
}

// Mapping from SegmentationUpidType enum value to human-readable string
export const SegmentationUpidTypeMap: { [key in SegmentationUpidType]?: string } = {
    [SegmentationUpidType.NOT_USED]: "Not Used",
    [SegmentationUpidType.USER_DEFINED]: "User Defined (Deprecated)",
    [SegmentationUpidType.ISCI]: "ISCI (Deprecated)",
    [SegmentationUpidType.AD_ID]: "Ad-ID",
    [SegmentationUpidType.UMID]: "UMID (SMPTE S330M)",
    [SegmentationUpidType.ISAN]: "ISAN (ISO 15706, Deprecated)",
    [SegmentationUpidType.VISAN]: "VISAN (ISO 26300-2)",
    [SegmentationUpidType.TID]: "Tribune Media Systems Program identifier",
    [SegmentationUpidType.TI]: "AiringID (formerly Turner ID)",
    [SegmentationUpidType.ADI]: "CableLabs Content Identifier",
    [SegmentationUpidType.EIDR]: "EIDR (Entertainment Identifier Registry)",
    [SegmentationUpidType.ATSC]: "ATSC Content Identifier",
    [SegmentationUpidType.MPU]: "Managed Private UPID",
    [SegmentationUpidType.MID]: "Multiple UPID types",
    [SegmentationUpidType.ADS]: "Advertising Digital Identification, LLC",
    [SegmentationUpidType.URI]: "URI (RFC 3986)",
};

export const enum SegmentationTypeId {
    NOT_INDICATED = 0x00,
    CONTENT_IDENTIFICATION = 0x01,
    CALL_AD_SERVER = 0x02,
    PROGRAM_START = 0x10,
    PROGRAM_END = 0x11,
    PROGRAM_EARLY_TERMINATION = 0x12,
    PROGRAM_BREAKAWAY = 0x13,
    PROGRAM_RESUMPTION = 0x14,
    PROGRAM_RUNOVER_PLANNED = 0x15,
    PROGRAM_RUNOVER_UNPLANNED = 0x16,
    PROGRAM_OVERLAP_START = 0x17,
    PROGRAM_BLACKOUT_OVERRIDE = 0x18,
    PROGRAM_START_IN_PROGRESS = 0x19,
    CHAPTER_START = 0x20,
    CHAPTER_END = 0x21,
    PROVIDER_ADVERTISEMENT_START = 0x30,
    PROVIDER_ADVERTISEMENT_END = 0x31,
    DISTRIBUTOR_ADVERTISEMENT_START = 0x32,
    DISTRIBUTOR_ADVERTISEMENT_END = 0x33,
    PROVIDER_PLACEMENT_OPPORTUNITY_START = 0x34,
    PROVIDER_PLACEMENT_OPPORTUNITY_END = 0x35,
    DISTRIBUTOR_PLACEMENT_OPPORTUNITY_START = 0x36,
    DISTRIBUTOR_PLACEMENT_OPPORTUNITY_END = 0x37,
    UNSCHEDULED_EVENT_START = 0x40,
    UNSCHEDULED_EVENT_END = 0x41,
    NETWORK_START = 0x50,
    NETWORK_END = 0x51,
}

// Mapping from SegmentationTypeId enum value to human-readable string
export const SegmentationTypeIdMap: { [key in SegmentationTypeId]?: string } = {
    [SegmentationTypeId.NOT_INDICATED]: "Not Indicated",
    [SegmentationTypeId.CONTENT_IDENTIFICATION]: "Content Identification",
    [SegmentationTypeId.CALL_AD_SERVER]: "Call Ad Server",
    [SegmentationTypeId.PROGRAM_START]: "Program Start",
    [SegmentationTypeId.PROGRAM_END]: "Program End",
    [SegmentationTypeId.PROGRAM_EARLY_TERMINATION]: "Program Early Termination",
    [SegmentationTypeId.PROGRAM_BREAKAWAY]: "Program Breakaway",
    [SegmentationTypeId.PROGRAM_RESUMPTION]: "Program Resumption",
    [SegmentationTypeId.PROGRAM_RUNOVER_PLANNED]: "Program Runover Planned",
    [SegmentationTypeId.PROGRAM_RUNOVER_UNPLANNED]: "Program Runover Unplanned",
    [SegmentationTypeId.PROGRAM_OVERLAP_START]: "Program Overlap Start",
    [SegmentationTypeId.PROGRAM_BLACKOUT_OVERRIDE]: "Program Blackout Override",
    [SegmentationTypeId.PROGRAM_START_IN_PROGRESS]: "Program Start In Progress",
    [SegmentationTypeId.CHAPTER_START]: "Chapter Start",
    [SegmentationTypeId.CHAPTER_END]: "Chapter End",
    [SegmentationTypeId.PROVIDER_ADVERTISEMENT_START]: "Provider Advertisement Start",
    [SegmentationTypeId.PROVIDER_ADVERTISEMENT_END]: "Provider Advertisement End",
    [SegmentationTypeId.DISTRIBUTOR_ADVERTISEMENT_START]: "Distributor Advertisement Start",
    [SegmentationTypeId.DISTRIBUTOR_ADVERTISEMENT_END]: "Distributor Advertisement End",
    [SegmentationTypeId.PROVIDER_PLACEMENT_OPPORTUNITY_START]: "Provider Placement Opportunity Start",
    [SegmentationTypeId.PROVIDER_PLACEMENT_OPPORTUNITY_END]: "Provider Placement Opportunity End",
    [SegmentationTypeId.DISTRIBUTOR_PLACEMENT_OPPORTUNITY_START]: "Distributor Placement Opportunity Start",
    [SegmentationTypeId.DISTRIBUTOR_PLACEMENT_OPPORTUNITY_END]: "Distributor Placement Opportunity End",
    [SegmentationTypeId.UNSCHEDULED_EVENT_START]: "Unscheduled Event Start",
    [SegmentationTypeId.UNSCHEDULED_EVENT_END]: "Unscheduled Event End",
    [SegmentationTypeId.NETWORK_START]: "Network Start",
    [SegmentationTypeId.NETWORK_END]: "Network End",
};

export enum SegmentationMessage {
    RESTRICT_GROUP_0 = 0x00,
    RESTRICT_GROUP_1 = 0x01,
    RESTRICT_GROUP_2 = 0x02,
    NONE = 0x03,
}

/**
 * 10.3.3 Segmentation_descriptor()
 */
export interface ISegmentationDescriptor extends ISpliceDescriptorBase {
    segmentationEventId: number;
    segmentationEventCancelIndicator: boolean;
    programSegmentationFlag?: boolean;
    segmentationDurationFlag?: boolean;
    deliveryNotRestrictedFlag?: boolean;
    webDeliveryAllowedFlag?: boolean;
    noRegionalBlackoutFlag?: boolean;
    archiveAllowedFlag?: boolean;
    deviceRestrictions?: SegmentationMessage;
    componentCount?: number;
    // component Tag, pts_offset
    segmentationDuration?: number;
    segmentationDuration_hms?: string; // HH:MM:SS.mmm
    segmentationDuration_s?: number; // seconds
    segmentationDuration_float?: number; // seconds
    segmentationUpidType?: SegmentationUpidType;
    segmentationUpidType_name?: string; // Human-readable name
    segmentationUpidType_hex?: string; // Hex representation
    segmentationUpidLength?: number;
    segmentationUpid?: Uint8Array;
    segmentationUpid_hex?: string; // Hex representation of bytes
    segmentationUpid_ascii?: string; // ASCII string (non-printable replaced with '?')
    // NOTE(estobbart): Even if this type is 0x34 || 0x36,
    // the subSegment* values could still be undefined.
    // The availability of those values depends on the origination
    // of the SCTE35 data and if the 2016 spec is implemented.
    segmentationTypeId?: SegmentationTypeId;
    segmentationTypeId_name?: string; // Human-readable name
    segmentationTypeId_hex?: string; // Hex representation (e.g., "0x37")
    segmentNum?: number;
    segmentsExpected?: number;
    subSegmentNum?: number;
    subSegmentsExpected?: number;
}

/**
 * 10.3.4 time_descriptor()
 */
export interface ITimeDescriptor extends ISpliceDescriptorBase {
    taiSeconds: number;
    taiNs: number;
    utcOffset: number;
}

export type ISpliceDescriptor = IAvailDescriptor | IDTMFDescriptor | ISegmentationDescriptor | ITimeDescriptor;

/**
 * 10.2 splice_descriptor()
 *
 * NOTE(estobbart): This only supports the base descriptor parsing,
 * Additional payload of the descriptor is handled at the SpliceInfoSection
 * level.
 */
const spliceDescriptor = (view: DataView): ISpliceDescriptor => {
    const descriptor = {} as ISpliceDescriptor;
    let offset = 0;
    descriptor.spliceDescriptorTag = view.getUint8(offset++);
    descriptor.spliceDescriptorTag_name = SpliceDescriptorTagMap[descriptor.spliceDescriptorTag] ?? `unknown (0x${descriptor.spliceDescriptorTag.toString(16)})`; // Add name
    descriptor.descriptorLength = view.getUint8(offset++);
    descriptor.identifier = "";
    while (descriptor.identifier.length < 4) {
        descriptor.identifier += String.fromCharCode(view.getUint8(offset++));
    }

    return descriptor;
};

/**
 * NOTE(estobbart): The view.byteLength may have additional data beyond
 * the descriptorLength if there are additional descriptors in the
 * array beyond the one being parse at the byteOffset of the view.
 */
export const parseDescriptor = (view: DataView): ISpliceDescriptor => {
    const descriptor = spliceDescriptor(view);
    // splice_descriptor_tag, descriptor_length, & identifier are the first 6 bytes
    let offset = 6;

    // TODO: parse out the descriptors appropriately using descriptor methods
    if (descriptor.spliceDescriptorTag === SpliceDescriptorTag.AVAIL_DESCRIPTOR) {
        offset = descriptor.descriptorLength + 2;
        console.warn("scte35-js TODO: support spliceDescriptorTag: SpliceDescriptorTag.AVAIL_DESCRIPTOR"); // Reinstate warn
        descriptor._parsing_status = "Payload parsing not implemented"; // Use renamed field
    } else if (descriptor.spliceDescriptorTag === SpliceDescriptorTag.DTMF_DESCRIPTOR) {
        offset = descriptor.descriptorLength + 2;
        console.warn("scte35-js TODO: support spliceDescriptorTag: SpliceDescriptorTag.DTMF_DESCRIPTOR"); // Reinstate warn
        descriptor._parsing_status = "Payload parsing not implemented"; // Use renamed field
    } else if (descriptor.spliceDescriptorTag === SpliceDescriptorTag.SEGMENTATION_DESCRIPTOR) {
        const segmentationDescriptor = descriptor as ISegmentationDescriptor;

        segmentationDescriptor.segmentationEventId = view.getUint32(offset);
        offset += 4;

        segmentationDescriptor.segmentationEventCancelIndicator = !!(view.getUint8(offset++) & 0x80);
        // next 7 bits are reserved

        if (!segmentationDescriptor.segmentationEventCancelIndicator) {
            const tmpByte = view.getUint8(offset++);
            segmentationDescriptor.programSegmentationFlag = !!(tmpByte & 0x80);
            segmentationDescriptor.segmentationDurationFlag = !!(tmpByte & 0x40);
            segmentationDescriptor.deliveryNotRestrictedFlag = !!(tmpByte & 0x20);

            if (!segmentationDescriptor.deliveryNotRestrictedFlag) {
                segmentationDescriptor.webDeliveryAllowedFlag = !!(tmpByte & 0x10);
                segmentationDescriptor.noRegionalBlackoutFlag = !!(tmpByte & 0x08);
                segmentationDescriptor.archiveAllowedFlag = !!(tmpByte & 0x04);
                segmentationDescriptor.deviceRestrictions = tmpByte & 0x03;
            }

            if (!segmentationDescriptor.programSegmentationFlag) {
                segmentationDescriptor.componentCount = view.getUint8(offset++);
                console.warn(
                    "scte35-js TODO: segmentationDescriptor.componentCount: " + segmentationDescriptor.componentCount,
                );
                // TODO: component count
                offset += segmentationDescriptor.componentCount * 6;
            }

            if (segmentationDescriptor.segmentationDurationFlag) {
                segmentationDescriptor.segmentationDuration = util.shiftThirtyTwoBits(view.getUint8(offset++));
                segmentationDescriptor.segmentationDuration += view.getUint32(offset);
                segmentationDescriptor.segmentationDuration_hms = util.formatDuration(
                    segmentationDescriptor.segmentationDuration,
                ); // Format duration
                segmentationDescriptor.segmentationDuration_s =
                    segmentationDescriptor.segmentationDuration / 90000.0; // Calculate float seconds
                offset += 4;
            }

            segmentationDescriptor.segmentationUpidType = view.getUint8(offset++);
            segmentationDescriptor.segmentationUpidType_name =
                SegmentationUpidTypeMap[segmentationDescriptor.segmentationUpidType] ?? // Add name
                `unknown (0x${segmentationDescriptor.segmentationUpidType.toString(16)})`;
            segmentationDescriptor.segmentationUpidType_hex = `0x${segmentationDescriptor.segmentationUpidType
                .toString(16)
                .padStart(2, "0")}`; // Add hex
            segmentationDescriptor.segmentationUpidLength = view.getUint8(offset++);

            let bytesToCopy = segmentationDescriptor.segmentationUpidLength;
            segmentationDescriptor.segmentationUpid = new Uint8Array(bytesToCopy);
            while (bytesToCopy >= 0) {
                bytesToCopy--;
                segmentationDescriptor.segmentationUpid[bytesToCopy] = view.getUint8(offset + bytesToCopy);
            }
            offset += segmentationDescriptor.segmentationUpidLength;

            // Convert UPID bytes to ASCII string (replacing non-printable with '?')
            segmentationDescriptor.segmentationUpid_ascii = util.bytesToAsciiString(segmentationDescriptor.segmentationUpid);
            // Convert UPID bytes to hex string
            segmentationDescriptor.segmentationUpid_hex = segmentationDescriptor.segmentationUpid
                ? `0x${Array.from(segmentationDescriptor.segmentationUpid)
                      .map((b) => b.toString(16).padStart(2, "0"))
                      .join("")}`
                : "";

            segmentationDescriptor.segmentationTypeId = view.getUint8(offset++);
            segmentationDescriptor.segmentationTypeId_name =
                SegmentationTypeIdMap[segmentationDescriptor.segmentationTypeId] ?? // Use the map
                `unknown (0x${segmentationDescriptor.segmentationTypeId.toString(16)})`;
            segmentationDescriptor.segmentationTypeId_hex = `0x${segmentationDescriptor.segmentationTypeId.toString(16).padStart(2, '0')}`; // Add hex value
            segmentationDescriptor.segmentNum = view.getUint8(offset++);
            segmentationDescriptor.segmentsExpected = view.getUint8(offset++);

            if (
                offset < descriptor.descriptorLength + 2 &&
                (segmentationDescriptor.segmentationTypeId === 0x34 ||
                    segmentationDescriptor.segmentationTypeId === 0x36)
            ) {
                // NOTE(estobbart): The older SCTE-35 spec did not include
                // these additional two bytes
                segmentationDescriptor.subSegmentNum = view.getUint8(offset++);
                segmentationDescriptor.subSegmentsExpected = view.getUint8(offset++);
            }
        }
    } else if (descriptor.spliceDescriptorTag === SpliceDescriptorTag.TIME_DESCRIPTOR) {
        offset = descriptor.descriptorLength + 2;
        console.warn("scte35-js TODO: support spliceDescriptorTag: SpliceDescriptorTag.TIME_DESCRIPTOR"); // Reinstate warn
        descriptor._parsing_status = "Payload parsing for time_descriptor not implemented"; // Use renamed field
    } else {
        // console.error(`scte35-js Unrecognized spliceDescriptorTag ${descriptor.spliceDescriptorTag}`);
        // Cast to number to satisfy TypeScript in the 'else' block
        descriptor._parsing_status = `Unrecognized tag (0x${(descriptor.spliceDescriptorTag as number).toString(16).padStart(2, '0')})`; // Use renamed field
        offset = descriptor.descriptorLength + 2;
    }

    if (offset !== descriptor.descriptorLength + 2) {
        console.error(`scte35-js Error reading descriptor offset @${offset} of ${descriptor.descriptorLength + 2}`);
    }

    return descriptor;
};
