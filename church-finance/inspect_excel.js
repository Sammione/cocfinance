const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.resolve('c:/Users/somol/Downloads/financecoc/Church of Christ Financial Record.xlsx');
const workbook = XLSX.readFile(filePath);

// Parse pledges
const pledgeSheet = workbook.Sheets['Pledges for church Programmes'];
const pledgeRaw = pledgeSheet ? XLSX.utils.sheet_to_json(pledgeSheet, { header: 1 }).filter(r => r && r.length > 0) : [];
console.log('Pledge Headers:', pledgeRaw[0]);
console.log('Pledge Row 2:', pledgeRaw[1]);
console.log('Pledge Row 3:', pledgeRaw[2]);
console.log('Pledge Row 4:', pledgeRaw[3]);
console.log('Pledge Row 5:', pledgeRaw[4]);
console.log('Pledge Total rows:', pledgeRaw.length);

// Health Fund
const healthSheet = workbook.Sheets['Health Fund Account'];
const healthRaw = healthSheet ? XLSX.utils.sheet_to_json(healthSheet, { header: 1 }).filter(r => r && r.length > 0) : [];
console.log('\nHealth Fund Headers:', healthRaw[0]);
console.log('Health Fund Row 2:', healthRaw[1]);
console.log('Health Fund Total rows:', healthRaw.length);

// Diaspora
const diasporaSheet = workbook.Sheets['Diaspora Inflow'];
const diasporaRaw = diasporaSheet ? XLSX.utils.sheet_to_json(diasporaSheet, { header: 1 }).filter(r => r && r.length > 0) : [];
console.log('\nDiaspora Headers:', diasporaRaw[0]);
console.log('Diaspora Row 2:', diasporaRaw[1]);
console.log('Diaspora Total rows:', diasporaRaw.length);

// Egbeda
const egbedaSheet = workbook.Sheets['Collection for Egbeda Sister'];
const egbedaRaw = egbedaSheet ? XLSX.utils.sheet_to_json(egbedaSheet, { header: 1 }).filter(r => r && r.length > 0) : [];
console.log('\nEgbeda Headers:', egbedaRaw[0]);
console.log('Egbeda Row 2:', egbedaRaw[1]);
console.log('Egbeda Total rows:', egbedaRaw.length);

// Save all extra data
const extraData = { pledges: pledgeRaw, healthFund: healthRaw, diaspora: diasporaRaw, egbeda: egbedaRaw };
fs.writeFileSync('src/data/extra_data.json', JSON.stringify(extraData, null, 2));
console.log('\nSaved extra data');
