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
describe('Programs API', () => {
    let programId;
    it('should create a new program', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/programs').send({
            name: 'Test Program',
            description: 'A test program',
            programCategory: 'BACHELOR',
            programType: 'B.S.',
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('programId');
        programId = res.body.programId;
    }));
    it('should fetch all programs', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/programs');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    }));
    it('should fetch a program by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/programs/${programId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.programId).toBe(programId);
    }));
    it('should update a program', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).patch(`/api/programs/${programId}`).send({
            name: 'Updated Program Name',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Updated Program Name');
    }));
    it('should delete a program', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/programs/${programId}`);
        expect(res.statusCode).toBe(204);
    }));
});
