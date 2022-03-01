import errorHandler from 'errorhandler';
import { createConnection } from 'typeorm';
import app from './app';

/**
 * Error Handler. Provides full stack
 */
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}

/**
 * Start Express server.
 */
createConnection()
  .then(() => {
    app.listen(app.get('port'), () => {
      console.log(
        '  App is running at http://localhost:%d in %s mode',
        app.get('port'),
        app.get('env'),
      );
      console.log('  Press CTRL-C to stop\n');
    });
  })
  .catch((err) => {
    console.log('Database connection error: ', err);
  });
