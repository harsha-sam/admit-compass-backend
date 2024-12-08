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
describe('Attributes API', () => {
    let attributeId;
    it('should create a new attribute', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/attributes').send({
            name: 'Language Prof',
            displayName: 'Language Proficiency',
            type: 'dropdown',
            isGlobal: true,
            options: [
                { value: 'basic', label: 'Basic' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
            ],
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('attributeId');
        attributeId = res.body.attributeId;
    }));
    it('should fetch all attributes', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/attributes');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    }));
    it('should fetch an attribute by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/attributes/${attributeId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.attributeId).toBe(attributeId);
    }));
    it('should update an attribute', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).patch(`/api/attributes/${attributeId}`).send({
            displayName: 'Updated Language Proficiency',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.displayName).toBe('Updated Language Proficiency');
    }));
    it('should delete an attribute', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/attributes/${attributeId}`);
        expect(res.statusCode).toBe(204);
    }));
});
describe('Attributes API with Rules', () => {
    let attributeId;
    it('should create an attribute with rules', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/attributes').send({
            name: 'Test Attribute',
            displayName: 'Test Attribute',
            type: 'dropdown',
            options: [
                { value: 'A', label: 'Option A' },
                { value: 'B', label: 'Option B' },
            ],
            rules: [
                {
                    action: { type: 'HIDE' },
                    logicOperator: 'AND',
                    conditions: [
                        { evaluatedAttributeId: 4, operator: '=', value1: 'yes' },
                    ],
                },
            ],
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('attributeId');
        attributeId = res.body.attributeId;
    }));
    it('should update an attribute and its rules', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).patch(`/api/attributes/${attributeId}`).send({
            displayName: 'Updated Attribute Name',
            rules: [
                {
                    action: { type: 'SHOW_AND_MAKE_MANDATORY' },
                    logicOperator: 'OR',
                    conditions: [
                        { evaluatedAttributeId: 3, operator: '=', value1: 'TOEFL' },
                    ],
                },
            ],
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.rules[0].action.type).toBe('SHOW_AND_MAKE_MANDATORY');
    }));
    it('should delete an attribute and its rules', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/attributes/${attributeId}`);
        expect(res.statusCode).toBe(204);
    }));
});
