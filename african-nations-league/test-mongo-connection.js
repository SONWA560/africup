import { MongoClient } from 'mongodb';

// Test different connection string formats
const connectionStrings = [
  // With database name
  'mongodb+srv://4340789_db_user:DI7IKhCIe3mQzni6@cluster0.fkdkfg7.mongodb.net/african_nations_league?retryWrites=true&w=majority',
  
  // Without database name but with authSource
  'mongodb+srv://4340789_db_user:DI7IKhCIe3mQzni6@cluster0.fkdkfg7.mongodb.net/?authSource=admin&retryWrites=true&w=majority',
  
  // Minimal version
  'mongodb+srv://4340789_db_user:DI7IKhCIe3mQzni6@cluster0.fkdkfg7.mongodb.net/?retryWrites=true&w=majority',
];

async function testConnection(uri, index) {
  console.log(`\n🧪 Test ${index + 1}: Trying connection...`);
  console.log(`URI pattern: ${uri.replace(/:[^:@]+@/, ':****@')}`);
  
  const client = new MongoClient(uri);
  
  try {
    console.log('⏳ Connecting...');
    await client.connect();
    
    console.log('✅ Connection successful!');
    
    // Try to ping admin database
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Ping to admin database successful!');
    
    // List databases
    const adminDb = client.db().admin();
    const { databases } = await adminDb.listDatabases();
    console.log('📊 Available databases:', databases.map(db => db.name).join(', '));
    
    await client.close();
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('bad auth')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   1. Go to MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)');
      console.log('   2. Go to Database Access → Check that user "4340789_db_user" exists');
      console.log('   3. Verify the password is exactly: DI7IKhCIe3mQzni6');
      console.log('   4. Make sure the user has "Atlas admin" or "Read and write to any database" privileges');
    }
    
    try {
      await client.close();
    } catch (e) {
      // ignore close errors
    }
    
    return false;
  }
}

async function runTests() {
  console.log('🔐 MongoDB Connection Tester\n');
  console.log('Testing connection to Cluster0...\n');
  
  for (let i = 0; i < connectionStrings.length; i++) {
    const success = await testConnection(connectionStrings[i], i);
    if (success) {
      console.log('\n✨ Connection successful! Use this connection string in your app.');
      break;
    }
  }
}

runTests().catch(console.error);
