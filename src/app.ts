import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorHandler from './middelware/errorHandler';
import programRoutes from './routes/programRoutes';
import rubricRoutes from './routes/rubricRoute';
import attributeRoutes from './routes/attributeRoute';
import attributeCategoryRoutes from './routes/attributeCategoryRoute';
import rulesetRoutes from './routes/rulesetRoute';
import ruleRoutes from './routes/ruleRoute';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/programs', programRoutes);
app.use('/api/rubrics', rubricRoutes);
app.use('/api/attributes', attributeRoutes);
app.use('/api/attribute-categories', attributeCategoryRoutes);
app.use('/api/rulesets', rulesetRoutes);
app.use('/api/rules', ruleRoutes);

app.get('/', (req, res) => {
  res.send('Hello, world ! from the admit compass');
});

// Error Handling Middleware
app.use(errorHandler);

export default app;
