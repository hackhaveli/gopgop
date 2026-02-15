/**
 * Environment Check Script
 * Verifies Supabase configuration
 */

console.log('🔍 Checking Supabase Configuration...\n');

const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
];

let allPresent = true;

requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    const status = value ? '✅' : '❌';
    const display = value
        ? (value.substring(0, 20) + '...' + value.substring(value.length - 10))
        : 'MISSING';

    console.log(`${status} ${varName}: ${display}`);

    if (!value) {
        allPresent = false;
    }
});

console.log('\n');

if (!allPresent) {
    console.log('❌ Missing environment variables!');
    console.log('\n📋 To fix:');
    console.log('1. Create a .env.local file in the project root');
    console.log('2. Copy from .env.local.example');
    console.log('3. Fill in your Supabase credentials from:');
    console.log('   https://supabase.com/dashboard → Your Project → Settings → API\n');
} else {
    console.log('✅ All environment variables are set!');
    console.log('\n📋 Next steps:');
    console.log('1. Apply the database migration (see DATABASE_FIX_README.md)');
    console.log('2. Restart your dev server: npm run dev');
    console.log('3. Test signup with a new email\n');
}

// Optional: Test connection if env vars present
if (allPresent) {
    console.log('💡 Run "node scripts/fix-rls.mjs" to see migration SQL\n');
}
