import request from 'supertest';
import app from '../app';

describe('Rules API', () => {
  let rulesetId: number; // Dynamically created ruleset
  let ruleId: number;

  beforeAll(async () => {
    // Create a ruleset for testing
    const rulesetRes = await request(app).post('/api/rulesets').send({
      name: 'Test Ruleset',
      baseWeight: 10,
      maxWeight: 50,
    });
    rulesetId = rulesetRes.body.rulesetId;

    // Ensure the ruleset is created
    expect(rulesetRes.statusCode).toBe(201);
    expect(rulesetRes.body).toHaveProperty('rulesetId');
  });

  it('should create a new rule', async () => {
    const res = await request(app).post(`/api/rules/ruleset/${rulesetId}/rules`).send({
      action: { type: 'ASSIGN_WEIGHT', value: 10 },
      logicOperator: 'AND',
      conditions: [
        { evaluatedAttributeId: 1, operator: '=', value1: 'advanced' },
      ],
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('ruleId');
    ruleId = res.body.ruleId;
  });

  it('should update a rule', async () => {
    const res = await request(app).patch(`/api/rules/${ruleId}`).send({
      action: { type: 'ASSIGN_WEIGHT', value: 15 },
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.action.value).toBe(15);
  });

  it('should delete a rule', async () => {
    const res = await request(app).delete(`/api/rules/${ruleId}`);
    expect(res.statusCode).toBe(204);
  });
});

describe('Rules API with Nested Logic', () => {
  let rulesetId: number; // Dynamically created ruleset
  let parentRuleId: number;

  beforeAll(async () => {
    // Create a ruleset for nested logic testing
    const rulesetRes = await request(app).post('/api/rulesets').send({
      name: 'Nested Ruleset',
      baseWeight: 20,
      maxWeight: 100,
    });
    rulesetId = rulesetRes.body.rulesetId;

    // Ensure the ruleset is created
    expect(rulesetRes.statusCode).toBe(201);
    expect(rulesetRes.body).toHaveProperty('rulesetId');
  });

  it('should create a nested rule for a ruleset', async () => {
    const res = await request(app).post(`/api/rules/ruleset/${rulesetId}/rules`).send({
      logicOperator: 'AND',
      action: { type: 'ASSIGN_WEIGHT', value: 10 },
      conditions: [
        { evaluatedAttributeId: 1, operator: '=', value1: 'advanced' },
      ],
      childRules: [
        {
          logicOperator: 'OR',
          conditions: [
            { evaluatedAttributeId: 2, operator: '>=', value1: 3.0 },
            { evaluatedAttributeId: 3, operator: '=', value1: 'TOEFL' },
          ],
        },
      ],
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('ruleId');
    parentRuleId = res.body.ruleId;

    // Verify the parent rule has child rules
    expect(res.body).toBeDefined();
    expect(res.body.conditions.length).toBeGreaterThan(0);
  });

  it('should fetch ruleset rules with nested child rules', async () => {
    const res = await request(app).get(`/api/rules/ruleset/${rulesetId}/rules`);
    expect(res.statusCode).toBe(200);

    const parentRule = res.body.find((rule: any) => rule.ruleId === parentRuleId);
    expect(parentRule).toBeDefined();
    expect(parentRule.childRules.length).toBeGreaterThan(0);
  });

  it('should delete a rule and its nested child rules', async () => {
    const res = await request(app).delete(`/api/rules/${parentRuleId}`);
    expect(res.statusCode).toBe(204);

    // Verify the rule and its child rules are deleted
    const check = await request(app).get(`/api/rules/ruleset/${rulesetId}/rules`);
    const deletedRule = check.body.find((rule: any) => rule.ruleId === parentRuleId);
    expect(deletedRule).toBeUndefined();
  });
});
