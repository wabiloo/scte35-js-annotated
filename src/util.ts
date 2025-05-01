/**
 * Converts a Uint8Array(16) to it's UUID string
 */
export const bytesToUUID = (bytes: Uint8Array): string => {
    if (bytes.length !== 16) {
        throw new Error(`scte35-js Uint8Array uuid bad size: ${bytes.length}`);
    }
    return [].map
        .call(bytes, (byte: number, index: number) => {
            // left pad the hex result to two chars
            const hex = (byte <= 0x0f ? "0" : "") + byte.toString(16);
            // splice in "-" at position 4, 6, 8, 10
            if (index >= 4 && index <= 10 && index % 2 === 0) {
                return "-" + hex;
            }
            return hex;
        })
        .join("");
};

export const THIRTY_TWO_BIT_MULTIPLIER = Math.pow(2, 32);

/**
 * shifts a single byte by 32 bits
 */
export const shiftThirtyTwoBits = (byte: number): number => {
    return byte * THIRTY_TWO_BIT_MULTIPLIER;
};

/**
 * Converts a duration from 90kHz clock ticks to a formatted string HH:MM:SS.mmm.
 * @param ticks Duration in 90kHz clock ticks.
 * @returns Formatted duration string.
 */
export const formatDuration = (ticks: number): string => {
    if (ticks === null || ticks === undefined || ticks < 0) {
        return "";
    }

    const totalMilliseconds = Math.round(ticks / 90); // Convert 90kHz ticks to milliseconds

    const milliseconds = String(totalMilliseconds % 1000).padStart(3, "0");
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = String(totalMinutes % 60).padStart(2, "0");
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

/**
 * Converts a Uint8Array to an ASCII string.
 * Invalid characters are ignored.
 * @param bytes Uint8Array containing ASCII codes.
 * @returns ASCII string.
 */
export const bytesToAsciiString = (bytes: Uint8Array | undefined): string => {
    if (!bytes) {
        return "";
    }
    // Replace bytes outside printable ASCII range (32-126) with '?'
    const printableBytes = Array.from(bytes).map((byte) => (byte >= 32 && byte <= 126 ? byte : 63)); // 63 is ASCII for '?'
    return String.fromCharCode(...printableBytes);
};

/**
 * Converts a duration from 90kHz clock ticks to seconds, rounded to milliseconds.
 * @param ticks Duration in 90kHz clock ticks.
 * @returns Duration in seconds, rounded to 3 decimal places.
 */
export const ptsDurationToSeconds = (ticks: number): number => {
    if (ticks === null || ticks === undefined || ticks < 0) {
        return 0;
    }
    const seconds = ticks / 90000.0;
    return Math.round(seconds * 1000) / 1000; // Round to 3 decimal places
};
