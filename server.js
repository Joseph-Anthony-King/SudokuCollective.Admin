import express from 'express';
import history from 'connect-history-api-fallback';
import { networkInterfaces } from 'os';
import chalk from 'chalk';

const app = express();

app.use(history({ index: '/index.html' }));

app.use('/', express.static('app/dist', { index: 'index.html' }));

app.set('port', (process.env.PORT || 8082));

// get network interfaces in order to find the network address
const nets = networkInterfaces();
const results = Object.create(null);

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
    if (net.family === familyV4Value && !net.internal) {
      if (!results[name]) {
        results[name] = [];
      }
      results[name].push(net.address);
    }
  }
}

let networkAddress = '';

if (results['en0'] !== undefined) {
  networkAddress = results['en0'][0];
} else {
  networkAddress = results['Wi-Fi'][0];
}

app.listen(app.get('port'), () => {
  console.log(` App running at:\n - Local:   ${chalk.cyan(`http://localhost:${app.get('port')}/`)}\n - Network: ${chalk.cyan(`http://${networkAddress}:${app.get('port')}/`)}`);
});
