import request from 'supertest';
import app from '../src/app';

describe('Programs API', () => {
  let programId: number;

  it('should create a new program', async () => {
    const res = await request(app).post('/api/programs').send({
      name: 'Test Program',
      description: 'A test program',
      programCategory: 'BACHELOR',
      programType: 'B.S.',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('programId');
    programId = res.body.programId;
  });

  it('should fetch all programs', async () => {
    const res = await request(app).get('/api/programs');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should fetch a program by ID', async () => {
    const res = await request(app).get(`/api/programs/${programId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.programId).toBe(programId);
  });

  it('should update a program', async () => {
    const res = await request(app).patch(`/api/programs/${programId}`).send({
      name: 'Updated Program Name',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Program Name');
  });

  it('should delete a program', async () => {
    const res = await request(app).delete(`/api/programs/${programId}`);
    expect(res.statusCode).toBe(204);
  });
});
