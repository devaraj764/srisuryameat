"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateOTP() {
    const otpLength = 6;
    const min = Math.pow(10, otpLength - 1); // Minimum value (100000)
    const max = Math.pow(10, otpLength) - 1; // Maximum value (999999)
    // Generate a random number within the range of 100000 to 999999
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp;
}
exports.default = generateOTP;
