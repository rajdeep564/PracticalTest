import { initializeDatabase, seedInitialData } from './src/scripts/initDatabase';

async function main() {
  try {
    console.log('🚀 Starting database initialization...\n');
    
    await initializeDatabase();
    await seedInitialData();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('You can now start the server with: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error);
    process.exit(1);
  }
}

main();
