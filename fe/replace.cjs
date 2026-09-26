const fs = require('fs');
const path = require('path');

const API_URL_REPLACEMENT = 'import.meta.env.VITE_API_URL';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('c:/Users/asus/Pictures/Tugas/fe/src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  if (content.includes("'http://localhost:5000")) {
    content = content.replace(/'http:\/\/localhost:5000/g, '`${import.meta.env.VITE_API_URL || "http://localhost:5000"}');
    // because the end is a single quote, we replace the closing quote for these matches
    content = content.replace(/\/api\/([^']*)'/g, '/api/$1`');
    changed = true;
  }
  
  if (content.includes("http://localhost:5000")) {
    content = content.replace(/http:\/\/localhost:5000/g, '${import.meta.env.VITE_API_URL || "http://localhost:5000"}');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(f, content);
    console.log('Updated', f);
  }
});
