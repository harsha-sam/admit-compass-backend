"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const withAuth = (req, res, next) => {
    const { userId } = req.auth;
    req.auth = userId ? auth : {};
    next();
};
exports.default = withAuth;
