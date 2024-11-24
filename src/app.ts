import express from 'express';
import bodyParser from 'body-parser';
import programRoutes from './routes/programRoutes';

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api/programs', programRoutes);

app.get('/', (req, res) => {
  res.send('Hello, world ! from the admit compass');
});

export default app;
