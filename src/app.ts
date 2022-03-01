import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

// Create Express server
const app: express.Application = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//   (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     res.locals.user = req.user;
//     next();
//   },
// );

export default app;
