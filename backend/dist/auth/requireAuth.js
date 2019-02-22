"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
exports.default = passport.authenticate('jwt', { session: false });
