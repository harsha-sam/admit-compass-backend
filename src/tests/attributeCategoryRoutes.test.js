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
describe('Attribute Categories API', () => {
    let categoryId;
    it('should create a new attribute category', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/attribute-categories').send({
            name: 'Test Category',
            description: 'A test category',
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('categoryId');
        categoryId = res.body.categoryId;
    }));
    it('should fetch all attribute categories', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/attribute-categories');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    }));
    it('should fetch an attribute category by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/attribute-categories/${categoryId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.categoryId).toBe(categoryId);
    }));
    it('should update an attribute category', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).patch(`/api/attribute-categories/${categoryId}`).send({
            name: 'Updated Category Name',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Updated Category Name');
    }));
    it('should delete an attribute category', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/attribute-categories/${categoryId}`);
        expect(res.statusCode).toBe(204);
    }));
});
