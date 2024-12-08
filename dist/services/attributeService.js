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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const client_1 = require("@prisma/client");
const ruleService_1 = __importDefault(require("./ruleService"));
const getAllAttributes = () => __awaiter(void 0, void 0, void 0, function* () {
    const attributes = yield database_1.default.attribute.findMany({
        include: {
            category: true,
        },
    });
    // Fetch rules for all attributes
    const attributeRules = yield database_1.default.rule.findMany({
        include: { conditions: true },
    });
    // Map attributes to include their rules
    return attributes.map((attr) => {
        const rules = attributeRules.filter((rule) => rule.targetAttributeId === attr.attributeId);
        return Object.assign(Object.assign({}, attr), { options: attr.options ? JSON.parse(attr.options) : null, validationRule: attr.validationRule ? JSON.parse(attr.validationRule) : null, rules });
    });
});
const getAttributeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const attribute = yield database_1.default.attribute.findUnique({
        where: { attributeId: id },
        include: { category: true },
    });
    if (!attribute)
        return null;
    // Fetch rules for the attribute
    const rules = yield database_1.default.rule.findMany({
        where: { targetAttributeId: id },
        include: { conditions: true },
    });
    return Object.assign(Object.assign({}, attribute), { options: attribute.options ? JSON.parse(attribute.options) : null, validationRule: attribute.validationRule ? JSON.parse(attribute.validationRule) : null, rules });
});
const createAttribute = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { rules, categoryId, description, validationRule, type } = data, attributeData = __rest(data, ["rules", "categoryId", "description", "validationRule", "type"]);
    let options = (_a = data.options) === null || _a === void 0 ? void 0 : _a.filter((option) => option.label);
    const createdAttribute = yield database_1.default.attribute.create({
        data: Object.assign(Object.assign({}, attributeData), { type, categoryId: (_b = parseInt(categoryId)) !== null && _b !== void 0 ? _b : null, description: description !== null && description !== void 0 ? description : '', validationRule: validationRule ? JSON.stringify(validationRule) : client_1.Prisma.JsonNull, isGlobal: (_c = data.isGlobal) !== null && _c !== void 0 ? _c : false, options: options ? JSON.stringify(options) : client_1.Prisma.JsonNull }),
        include: { category: true },
    });
    if (rules === null || rules === void 0 ? void 0 : rules.length) {
        for (const rule of rules) {
            if (rule.conditions && rule.conditions.length > 0) {
                yield ruleService_1.default.createAttributeRule(createdAttribute.attributeId, rule);
            }
        }
    }
    return getAttributeById(createdAttribute.attributeId);
});
const updateAttribute = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { rules, categoryId, validationRule } = data, attributeData = __rest(data, ["rules", "categoryId", "validationRule"]);
    console.log(data, "data");
    let options = (_a = data.options) === null || _a === void 0 ? void 0 : _a.filter((option) => option.label);
    const updatedAttribute = yield database_1.default.attribute.update({
        where: { attributeId: id },
        data: Object.assign(Object.assign(Object.assign(Object.assign({}, attributeData), { categoryId: (_b = parseInt(categoryId)) !== null && _b !== void 0 ? _b : null }), (options !== undefined && { options: options ? JSON.stringify(options) : client_1.Prisma.JsonNull })), { validationRule: validationRule ? JSON.stringify(validationRule) : client_1.Prisma.JsonNull }),
        include: { category: true },
    });
    // Handle rules update
    if (rules) {
        // Delete all existing rules and recreate
        yield database_1.default.rule.deleteMany({ where: { targetAttributeId: id } });
        for (const rule of rules) {
            if (rule && rule.conditions && rule.conditions.length > 0) {
                yield ruleService_1.default.createAttributeRule(id, rule);
            }
        }
    }
    return getAttributeById(id);
});
const deleteAttribute = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.rule.deleteMany({ where: { targetAttributeId: id } });
    yield database_1.default.attribute.delete({
        where: { attributeId: id },
    });
});
exports.default = {
    getAllAttributes,
    getAttributeById,
    createAttribute,
    updateAttribute,
    deleteAttribute,
};
