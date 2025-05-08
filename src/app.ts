import express from 'express';
import { userHandlers } from './handlers/user-handlers';
import { taskHandlers } from './handlers/task-handlers';

const app = express();

app.use(express.json());
app.use(userHandlers);
app.use(taskHandlers);


export default app