// Quick fix - add auth endpoints to existing server
const fs = require('fs');

const authCode = `
// Simple test users
const testUsers = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { id: '2', name: 'Test User', email: 'test@example.com', password: 'test123', role: 'user' }
];

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = testUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: \`token_\${user.id}_\${Date.now()}\`
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  const existing = testUsers.find(u => u.email === email);
  
  if (existing) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  
  const newUser = { id: String(testUsers.length + 1), name, email, password, role: 'user' };
  testUsers.push(newUser);
  
  res.json({
    success: true,
    message: 'Registration successful',
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    token: \`token_\${newUser.id}_\${Date.now()}\`
  });
});
`;

// Read the current server file
const serverPath = 'c:\\ecommerce-app\\backend\\amazon-complete-server.js';
let content = fs.readFileSync(serverPath, 'utf8');

// Add auth code before the server start
const insertPoint = content.indexOf('app.listen(PORT');
if (insertPoint > -1) {
  content = content.slice(0, insertPoint) + authCode + '\n' + content.slice(insertPoint);
  fs.writeFileSync(serverPath, content);
  console.log('✅ Auth endpoints added to server');
} else {
  console.log('❌ Could not find insertion point');
}