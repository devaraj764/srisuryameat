"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMails = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const nodemailer_1 = __importDefault(require("nodemailer"));
// Define the transporter
const transporter = nodemailer_1.default.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASSWORD
    }
});
// Function to send emails
function sendMails(subject, body, emails) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mailOptions = {
                from: process.env.APP_USER,
                to: emails.join(','),
                subject: subject,
                html: body
            };
            const info = yield transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            return true;
        }
        catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    });
}
exports.sendMails = sendMails;
