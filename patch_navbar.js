const fs = require('fs');
const path = 'anime-frontend/components/Navbar.tsx';
let data = fs.readFileSync(path, 'utf8');

data = data.replace(
  '  return (\n    <div className={`fixed top-0',
  '  if (pathname === "/login" || pathname === "/signup") return null;\n\n  return (\n    <div className={`fixed top-0'
);

fs.writeFileSync(path, data);
