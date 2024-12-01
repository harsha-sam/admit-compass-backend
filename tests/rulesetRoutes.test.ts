import request from 'supertest';
import app from '../src/app';

describe('Rulesets API', () => {
  let rulesetId: number;

  it('should create a new ruleset', async () => {
    const res = await request(app).post('/api/rulesets').send({
      name: 'Academic Ruleset',
      baseWeight: 10,
      maxWeight: 50,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('rulesetId');
    rulesetId = res.body.rulesetId;
  });

  it('should fetch all rulesets', async () => {
    const res = await request(app).get('/api/rulesets');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should fetch a ruleset by ID', async () => {
    const res = await request(app).get(`/api/rulesets/${rulesetId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.rulesetId).toBe(rulesetId);
  });

  it('should update a ruleset', async () => {
    const res = await request(app).patch(`/api/rulesets/${rulesetId}`).send({
      name: 'Updated Ruleset Name',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Ruleset Name');
  });

  it('should delete a ruleset', async () => {
    const res = await request(app).delete(`/api/rulesets/${rulesetId}`);
    expect(res.statusCode).toBe(204);
  });
});

describe('Rulesets API with Rules', () => {
  let rulesetId: number;

  it('should create a ruleset with associated rules', async () => {
    const res = await request(app).post('/api/rulesets').send({
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
  });

  it('should update a ruleset and its associated rules', async () => {
    const res = await request(app).patch(`/api/rulesets/${rulesetId}`).send({
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
  });

  it('should delete a ruleset and all associated rules', async () => {
    const res = await request(app).delete(`/api/rulesets/${rulesetId}`);
    expect(res.statusCode).toBe(204);
  });
});
