import db from './src/config/db.js';
import fs from 'fs';
db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'restaurants'").then(res => {
  fs.writeFileSync('cols.json', JSON.stringify(res[0].map(r => r.column_name)));
  process.exit(0);
});
