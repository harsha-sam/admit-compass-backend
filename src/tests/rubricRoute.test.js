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
describe('Rubrics API', () => {
    let rubricId;
    it('should create a new rubric', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/rubrics').send({
            name: 'Quantitative Rubric',
            maxWeight: 100,
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('rubricId');
        rubricId = res.body.rubricId;
    }));
    it('should fetch all rubrics', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/rubrics');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    }));
    it('should fetch a rubric by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/rubrics/${rubricId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.rubricId).toBe(rubricId);
    }));
    it('should update a rubric', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).patch(`/api/rubrics/${rubricId}`).send({
            name: 'Updated Rubric Name',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Updated Rubric Name');
    }));
    it('should delete a rubric', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/rubrics/${rubricId}`);
        expect(res.statusCode).toBe(204);
    }));
});
