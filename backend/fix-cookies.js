const fs = require('fs');

const filePath = 'mongodb-server.js';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all cookie configurations
content = content.replace(/secure: process\.env\.NODE_ENV === 'production',/g, 'secure: false,');
content = content.replace(/sameSite: 'strict',/g, "sameSite: 'lax',");

fs.writeFileSync(filePath, content);
console.log('✅ Cookie settings updated for development');