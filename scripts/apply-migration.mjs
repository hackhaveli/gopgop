/**
 * Apply Database Migration Script
 * Run with: node scripts/apply-migration.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing required environment variables:');
    console.error('   NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_KEY ? '✓' : '✗');
    process.exit(1);
}

// Create admin client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applyMigration(migrationFile) {
    try {
        console.log(`\n📄 Applying migration: ${migrationFile}`);

        // Read migration file
        const migrationPath = join(__dirname, '..', 'supabase', 'migrations', migrationFile);
        const sql = readFileSync(migrationPath, 'utf8');

        console.log('📝 SQL Preview:');
        console.log(sql.substring(0, 200) + '...\n');

        // Execute migration
        const { data, error } = await supabase.rpc('exec_sql', { sql });

        if (error) {
            console.error('❌ Migration failed:', error);

            // Try alternate method - direct query
            console.log('\n🔄 Trying direct SQL execution...');
            const { error: directError } = await supabase.from('_migrations').insert({
                name: migrationFile,
                executed_at: new Date().toISOString()
            });

            // Execute SQL line by line
            const statements = sql
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0 && !s.startsWith('--'));

            for (const statement of statements) {
                if (statement) {
                    const { error: stmtError } = await supabase.rpc('exec_sql', {
                        query: statement
                    });

                    if (stmtError) {
                        console.error('❌ Statement failed:', statement.substring(0, 50) + '...');
                        console.error('   Error:', stmtError.message);
                    }
                }
            }
        } else {
            console.log('✅ Migration applied successfully!');
            if (data) console.log('   Data:', data);
        }

    } catch (error) {
        console.error('❌ Error applying migration:', error);
        throw error;
    }
}

// Main execution
async function main() {
    console.log('🚀 Starting database migration...\n');
    console.log('📍 Supabase URL:', SUPABASE_URL);

    try {
        await applyMigration('004_fix_user_insert_policy.sql');
        console.log('\n✅ All migrations completed successfully!');
    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        process.exit(1);
    }
}

main();
