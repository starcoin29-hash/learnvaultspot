import fs from 'fs';
import path from 'path';

function walkDir(dir: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (stat.isFile() && filePath.endsWith('.tsx')) {
      callback(filePath);
    }
  }
}

function searchOnClick() {
  const appDir = path.resolve(process.cwd(), 'app');
  if (!fs.existsSync(appDir)) {
    console.error('App directory not found.');
    return;
  }

  console.log('Scanning app directory for onClick in Server Components...');
  walkDir(appDir, (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file is a Client Component
    const isClientComponent = content.includes('"use client"') || content.includes("'use client'");
    
    if (!isClientComponent) {
      // Find onClick occurrences
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.includes('onClick={')) {
          console.log(`\nFound onClick in Server Component:`);
          console.log(`  File: ${filePath}`);
          console.log(`  Line ${index + 1}: ${line.trim()}`);
        }
      });
    }
  });
  console.log('\nScan complete!');
}

searchOnClick();
