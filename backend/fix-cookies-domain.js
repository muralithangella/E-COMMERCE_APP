const fs = require('fs');

const filePath = 'mongodb-server.js';
let content = fs.readFileSync(filePath, 'utf8');

// Replace cookie configurations
content = content.replace(/sameSite: 'lax',/g, "sameSite: 'none',");
content = content.replace(/maxAge: 15 \* 60 \* 1000 \/\/ 15 minutes/g, "domain: 'localhost',\n      maxAge: 15 * 60 * 1000 // 15 minutes");
content = content.replace(/maxAge: 7 \* 24 \* 60 \* 60 \* 1000 \/\/ 7 days/g, "domain: 'localhost',\n      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days");

fs.writeFileSync(filePath, content);
console.log('✅ Cookie domain settings updated');