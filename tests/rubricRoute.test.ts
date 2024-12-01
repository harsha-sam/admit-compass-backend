import request from 'supertest';
import app from '../src/app';

describe('Rubrics API', () => {
  let rubricId: number;

  it('should create a new rubric', async () => {
    const res = await request(app).post('/api/rubrics').send({
      name: 'Quantitative Rubric',
      maxWeight: 100,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('rubricId');
    rubricId = res.body.rubricId;
  });

  it('should fetch all rubrics', async () => {
    const res = await request(app).get('/api/rubrics');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should fetch a rubric by ID', async () => {
    const res = await request(app).get(`/api/rubrics/${rubricId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.rubricId).toBe(rubricId);
  });

  it('should update a rubric', async () => {
    const res = await request(app).patch(`/api/rubrics/${rubricId}`).send({
      name: 'Updated Rubric Name',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Rubric Name');
  });

  it('should delete a rubric', async () => {
    const res = await request(app).delete(`/api/rubrics/${rubricId}`);
    expect(res.statusCode).toBe(204);
  });
});
