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
describe('Rulesets API', () => {
    let rulesetId;
    it('should create a new ruleset', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/rulesets').send({
            name: 'Academic Ruleset',
            baseWeight: 10,
            maxWeight: 50,
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('rulesetId');
        rulesetId = res.body.rulesetId;
    }));
    it('should fetch all rulesets', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/rulesets');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    }));
    it('should fetch a ruleset by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/rulesets/${rulesetId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.rulesetId).toBe(rulesetId);
    }));
    it('should update a ruleset', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).patch(`/api/rulesets/${rulesetId}`).send({
            name: 'Updated Ruleset Name',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Updated Ruleset Name');
    }));
    it('should delete a ruleset', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/rulesets/${rulesetId}`);
        expect(res.statusCode).toBe(204);
    }));
});
describe('Rulesets API with Rules', () => {
    let rulesetId;
    it('should create a ruleset with associated rules', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/rulesets').send({
            name: 'Test Ruleset',
            baseWeight: 10,
            maxWeight: 50,
            rules: [
                {
                    logicOperator: 'AND',
                    action: { type: 'ADD_WEIGHT', value: 10 },
                    conditions: [
                        { evaluatedAttributeId: 1, operator: '=', value1: 'advanced' },
                    ],
                },
            ],
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('rulesetId');
        expect(res.body.rules.length).toBeGreaterThan(0);
        rulesetId = res.body.rulesetId;
    }));
    it('should update a ruleset and its associated rules', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).patch(`/api/rulesets/${rulesetId}`).send({
            name: 'Updated Ruleset Name',
            rules: [
                {
                    logicOperator: 'AND',
                    action: { type: 'MULTIPLY_WEIGHT', value: 1.2 },
                    conditions: [
                        { evaluatedAttributeId: 2, operator: '>=', value1: 3.5 },
                    ],
                },
            ],
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.rules[0].action.type).toBe('MULTIPLY_WEIGHT');
    }));
    it('should delete a ruleset and all associated rules', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/rulesets/${rulesetId}`);
        expect(res.statusCode).toBe(204);
    }));
});
