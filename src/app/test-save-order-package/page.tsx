import fs from 'fs';
import path from 'path';

export default function TestSaveOrderPackagePage() {
  const htmlPath = path.join(process.cwd(), 'src', 'app', 'test-save-order-package.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}
