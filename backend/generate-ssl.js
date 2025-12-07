const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const certsDir = path.join(__dirname, 'certs');

if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir);
}

console.log('Installing node-forge...');
execSync('npm install node-forge', { stdio: 'inherit', cwd: __dirname });

console.log('Generating SSL certificates...');

const forge = require('node-forge');
const pki = forge.pki;
const keys = pki.rsa.generateKeyPair(2048);
const cert = pki.createCertificate();

cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

const attrs = [{
  name: 'commonName',
  value: 'localhost'
}];

cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.sign(keys.privateKey);

const pemCert = pki.certificateToPem(cert);
const pemKey = pki.privateKeyToPem(keys.privateKey);

fs.writeFileSync(path.join(certsDir, 'cert.pem'), pemCert);
fs.writeFileSync(path.join(certsDir, 'key.pem'), pemKey);

console.log('SSL certificates generated successfully in backend/certs/');
