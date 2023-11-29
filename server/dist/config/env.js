"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenSecret = exports.port = exports.databaseURL = exports.secretKey = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.secretKey = process.env.SECRET_KEY || 'your-secret-key';
exports.databaseURL = process.env.DB_URL;
exports.port = process.env.port || 4000;
exports.tokenSecret = process.env.TOKEN_SECRET || 'asdfghjkl';
