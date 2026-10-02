const fs = require('fs');

let lines = fs.readFileSync('c:/git/ImperialConectav2/app/page.tsx', 'utf-8').split('\n');

const importIndex = lines.findIndex(l => l.includes('import ImperialDashboard from'));
if (importIndex !== -1) {
    lines[importIndex] = "import { useRouter } from 'next/navigation';";
}

const appIndex = lines.findIndex(l => l.includes('export default function App() {'));
if (appIndex !== -1) {
    lines.splice(appIndex + 1, 0, '  const router = useRouter();');
}

const loginReturnIndex = lines.findIndex(l => l.includes('if (!isAuthenticated) {'));
if (loginReturnIndex !== -1) {
    lines[loginReturnIndex] = '';
    lines[loginReturnIndex + 1] = '  return (';
}

const isAuthIfIndex = lines.findIndex(l => l.includes('if (isAuthenticated) {'));
if (isAuthIfIndex !== -1) {
    lines[isAuthIfIndex] = '';
    lines[isAuthIfIndex + 1] = '';
    lines[isAuthIfIndex + 2] = '';
}

for(let i = 0; i < lines.length; i++) {
    if(lines[i].includes('min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased')) {
        // Find previous '  }'
        lines.splice(i - 2);
        lines.push('    );');
        lines.push('}');
        break;
    }
}

fs.writeFileSync('c:/git/ImperialConectav2/app/page.tsx', lines.join('\n'), 'utf-8');
console.log('Done modifying page.tsx');
