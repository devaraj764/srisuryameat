export default function generateOTP(): number {
    const otpLength: number = 6;
    const min: number = Math.pow(10, otpLength - 1); // Minimum value (100000)
    const max: number = Math.pow(10, otpLength) - 1; // Maximum value (999999)

    // Generate a random number within the range of 100000 to 999999
    const otp: number = Math.floor(Math.random() * (max - min + 1)) + min;

    return otp;
}