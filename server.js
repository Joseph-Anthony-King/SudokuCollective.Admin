import express from 'express';
import history from 'connect-history-api-fallback';

const app = express();

app.use(history({index: '/index.html'}));

app.use('/', express.static('app/dist', {index: 'index.html'}));

app.set('port', (process.env.PORT || 8082));

app.listen(app.get('port'), () => {
  console.log(`Server is listening on port ${app.get('port')}...`);
});
