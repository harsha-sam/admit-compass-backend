import request from 'supertest';
import app from '../app';

describe('Attribute Categories API', () => {
  let categoryId: number;

  it('should create a new attribute category', async () => {
    const res = await request(app).post('/api/attribute-categories').send({
      name: 'Test Category',
      description: 'A test category',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('categoryId');
    categoryId = res.body.categoryId;
  });

  it('should fetch all attribute categories', async () => {
    const res = await request(app).get('/api/attribute-categories');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should fetch an attribute category by ID', async () => {
    const res = await request(app).get(`/api/attribute-categories/${categoryId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.categoryId).toBe(categoryId);
  });

  it('should update an attribute category', async () => {
    const res = await request(app).patch(`/api/attribute-categories/${categoryId}`).send({
      name: 'Updated Category Name',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Category Name');
  });

  it('should delete an attribute category', async () => {
    const res = await request(app).delete(`/api/attribute-categories/${categoryId}`);
    expect(res.statusCode).toBe(204);
  });
});
