"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = __importDefault(require("./middelware/errorHandler"));
const programRoutes_1 = __importDefault(require("./routes/programRoutes"));
const rubricRoute_1 = __importDefault(require("./routes/rubricRoute"));
const attributeRoute_1 = __importDefault(require("./routes/attributeRoute"));
const attributeCategoryRoute_1 = __importDefault(require("./routes/attributeCategoryRoute"));
const rulesetRoute_1 = __importDefault(require("./routes/rulesetRoute"));
const ruleRoute_1 = __importDefault(require("./routes/ruleRoute"));
const express_2 = require("@clerk/express");
const app = (0, express_1.default)();
app.use((0, express_2.clerkMiddleware)());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Routes
app.use('/api/programs', programRoutes_1.default);
app.use('/api/rubrics', rubricRoute_1.default);
app.use('/api/attributes', attributeRoute_1.default);
app.use('/api/attribute-categories', attributeCategoryRoute_1.default);
app.use('/api/rulesets', rulesetRoute_1.default);
app.use('/api/rules', ruleRoute_1.default);
app.get('/', (req, res) => {
    res.send('Hello, world ! from the admit compass');
});
// Error Handling Middleware
app.use(errorHandler_1.default);
exports.default = app;
