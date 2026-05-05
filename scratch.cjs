const https = require('https');

https.get('https://ibb.co/album/4J5Qdg', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const regex = /"url":"(https:\\\/\\\/i\.ibb\.co\\\/[^"]+)"/g;
    const matches = new Set();
    let match;
    while ((match = regex.exec(data)) !== null) {
      matches.add(match[1].replace(/\\\//g, '/'));
    }
    console.log(Array.from(matches));
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
