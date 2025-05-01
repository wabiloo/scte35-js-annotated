import * as descriptors from "./descriptors";

export interface IBreakDuration {
    autoReturn: boolean;
    duration: number;
    duration_hms?: string; // HH:MM:SS.mmm
    duration_s?: number; // seconds
}

export interface ISpliceComponent {
    componentTag: number;
}

export interface IUTCSpliceComponent extends ISpliceComponent {
    utcSpliceTime: number;
}

export interface ISpliceEvent {
    spliceEventId: number;
    spliceEventCancelIndicator: boolean;
    outOfNetworkIndicator?: boolean;
    programSpliceFlag?: boolean;
    durationFlag?: boolean;
    componentCount?: number;
    breakDuration?: IBreakDuration;
    uniqueProgramId?: number;
    available?: number;
    expected?: number;
}

export interface ISpliceScheduleEvent extends ISpliceEvent {
    utcSpliceTime?: number;
    utcSpliceComponents?: IUTCSpliceComponent[];
}

export interface ISpliceSchedule {
    spliceCount: number;
    spliceEvents: ISpliceScheduleEvent[];
}

export interface ISpliceTimeComponent extends ISpliceComponent {
    spliceTime: number;
}

export interface ISpliceInsertEvent extends ISpliceEvent {
    spliceImmediateFlag?: boolean;
    spliceTime?: ISpliceTime;
    spliceTimeComponents?: ISpliceTimeComponent[];
}

export interface ISpliceTime {
    specified: boolean;
    pts?: number;
}

export interface ISplicePrivate {
    identifier: number;
    rawData: ArrayBuffer;
}

export interface ISCTE35 {
    /**
     * DASH as defined in SCTE 214-1 2016
     * Data should be from the @schemeIdUri="urn:scte:scte35:2014:xml+bin"
     * of an Signal.Binary element in the Event
     */
    parseFromB64: (b64: string) => ISpliceInfoSection;

    parseFromHex: (hex: string) => ISpliceInfoSection;
}

export interface ISpliceInfoSection {
    tableId?: number;
    selectionSyntaxIndicator?: boolean;
    privateIndicator?: boolean;
    sectionLength?: number;
    protocolVersion?: number;
    encryptedPacket?: boolean;
    encryptedAlgorithm?: number;
    ptsAdjustment?: number;
    cwIndex?: number;
    tier?: number;
    spliceCommandLength?: number;
    spliceCommandType?: SpliceCommandType;
    spliceCommandType_name?: string;
    spliceCommand?: SpliceCommand;
    descriptorLoopLength?: number;
    descriptors?: descriptors.ISpliceDescriptor[];
    // alignmentStuffing: number; TODO:
    crc?: number;
}

export const enum SpliceCommandType {
    SPLICE_NULL = 0x00,
    // RESERVED 0x01 - 0x03
    SPLICE_SCHEDULE = 0x04,
    SPLICE_INSERT = 0x05,
    TIME_SIGNAL = 0x06,
    BANDWIDTH_RESERVATION = 0x07,
    // RESERVED 0x08 - FE
    PRIVATE_COMMAND = 0xff, // TODO: support parsing into an array buffer or something?
}

// Mapping from SpliceCommandType enum value to human-readable string
export const SpliceCommandTypeMap: { [key in SpliceCommandType]?: string } = {
    [SpliceCommandType.SPLICE_NULL]: "splice_null",
    [SpliceCommandType.SPLICE_SCHEDULE]: "splice_schedule",
    [SpliceCommandType.SPLICE_INSERT]: "splice_insert",
    [SpliceCommandType.TIME_SIGNAL]: "time_signal",
    [SpliceCommandType.BANDWIDTH_RESERVATION]: "bandwidth_reservation",
    [SpliceCommandType.PRIVATE_COMMAND]: "private_command",
};

export type SpliceEvent = ISpliceScheduleEvent | ISpliceInsertEvent;
export type EventTag = SpliceCommandType.SPLICE_SCHEDULE | SpliceCommandType.SPLICE_INSERT;
export type SpliceCommand = ISpliceSchedule | ISpliceInsertEvent | ISpliceTime | ISplicePrivate;
