import request from 'supertest';
import app from '../src/app';

describe('Attributes API', () => {
  let attributeId: number;

  it('should create a new attribute', async () => {
    const res = await request(app).post('/api/attributes').send({
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
  });

  it('should fetch all attributes', async () => {
    const res = await request(app).get('/api/attributes');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should fetch an attribute by ID', async () => {
    const res = await request(app).get(`/api/attributes/${attributeId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.attributeId).toBe(attributeId);
  });

  it('should update an attribute', async () => {
    const res = await request(app).patch(`/api/attributes/${attributeId}`).send({
      displayName: 'Updated Language Proficiency',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.displayName).toBe('Updated Language Proficiency');
  });

  it('should delete an attribute', async () => {
    const res = await request(app).delete(`/api/attributes/${attributeId}`);
    expect(res.statusCode).toBe(204);
  });
});

describe('Attributes API with Rules', () => {
  let attributeId: number;

  it('should create an attribute with rules', async () => {
    const res = await request(app).post('/api/attributes').send({
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
  });

  it('should update an attribute and its rules', async () => {
    const res = await request(app).patch(`/api/attributes/${attributeId}`).send({
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
  });

  it('should delete an attribute and its rules', async () => {
    const res = await request(app).delete(`/api/attributes/${attributeId}`);
    expect(res.statusCode).toBe(204);
  });
});
