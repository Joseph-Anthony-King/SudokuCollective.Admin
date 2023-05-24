import express from 'express';
import history from 'connect-history-api-fallback';
import chalk from 'chalk';

const app = express();

app.use(history({index: '/index.html'}));

app.use('/', express.static('app/dist', {index: 'index.html'}));

app.set('port', (process.env.PORT || 8082));

app.listen(app.get('port'), () => {
  console.log(` App running at:\n - Local:   ${chalk.cyan(`http://localhost:${app.get('port')}/`)}\n - Network: ${chalk.cyan(`http://192.168.1.118:${app.get('port')}/`)}`);
});
