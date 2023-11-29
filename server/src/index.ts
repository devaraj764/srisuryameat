import express, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { port } from './config/env';
import routes from './routes'
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app: Express = express();

app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials: true
  }
));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use(routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).send(err.message)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
