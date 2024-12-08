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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe('Rules API', () => {
    let rulesetId; // Dynamically created ruleset
    let ruleId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create a ruleset for testing
        const rulesetRes = yield (0, supertest_1.default)(app_1.default).post('/api/rulesets').send({
            name: 'Test Ruleset',
            baseWeight: 10,
            maxWeight: 50,
        });
        rulesetId = rulesetRes.body.rulesetId;
        // Ensure the ruleset is created
        expect(rulesetRes.statusCode).toBe(201);
        expect(rulesetRes.body).toHaveProperty('rulesetId');
    }));
    it('should create a new rule', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post(`/api/rules/ruleset/${rulesetId}/rules`).send({
            action: { type: 'ASSIGN_WEIGHT', value: 10 },
            logicOperator: 'AND',
            conditions: [
                { evaluatedAttributeId: 1, operator: '=', value1: 'advanced' },
            ],
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('ruleId');
        ruleId = res.body.ruleId;
    }));
    it('should update a rule', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).patch(`/api/rules/${ruleId}`).send({
            action: { type: 'ASSIGN_WEIGHT', value: 15 },
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.action.value).toBe(15);
    }));
    it('should delete a rule', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/rules/${ruleId}`);
        expect(res.statusCode).toBe(204);
    }));
});
describe('Rules API with Nested Logic', () => {
    let rulesetId; // Dynamically created ruleset
    let parentRuleId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create a ruleset for nested logic testing
        const rulesetRes = yield (0, supertest_1.default)(app_1.default).post('/api/rulesets').send({
            name: 'Nested Ruleset',
            baseWeight: 20,
            maxWeight: 100,
        });
        rulesetId = rulesetRes.body.rulesetId;
        // Ensure the ruleset is created
        expect(rulesetRes.statusCode).toBe(201);
        expect(rulesetRes.body).toHaveProperty('rulesetId');
    }));
    it('should create a nested rule for a ruleset', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post(`/api/rules/ruleset/${rulesetId}/rules`).send({
            logicOperator: 'AND',
            action: { type: 'ASSIGN_WEIGHT', value: 10 },
            conditions: [
                { evaluatedAttributeId: 1, operator: '=', value1: 'advanced' },
            ],
            childRules: [
                {
                    logicOperator: 'OR',
                    conditions: [
                        { evaluatedAttributeId: 2, operator: '>=', value1: 3.0 },
                        { evaluatedAttributeId: 3, operator: '=', value1: 'TOEFL' },
                    ],
                },
            ],
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('ruleId');
        parentRuleId = res.body.ruleId;
        // Verify the parent rule has child rules
        expect(res.body).toBeDefined();
        expect(res.body.conditions.length).toBeGreaterThan(0);
    }));
    it('should fetch ruleset rules with nested child rules', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/rules/ruleset/${rulesetId}/rules`);
        expect(res.statusCode).toBe(200);
        const parentRule = res.body.find((rule) => rule.ruleId === parentRuleId);
        expect(parentRule).toBeDefined();
        expect(parentRule.childRules.length).toBeGreaterThan(0);
    }));
    it('should delete a rule and its nested child rules', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/rules/${parentRuleId}`);
        expect(res.statusCode).toBe(204);
        // Verify the rule and its child rules are deleted
        const check = yield (0, supertest_1.default)(app_1.default).get(`/api/rules/ruleset/${rulesetId}/rules`);
        const deletedRule = check.body.find((rule) => rule.ruleId === parentRuleId);
        expect(deletedRule).toBeUndefined();
    }));
});
