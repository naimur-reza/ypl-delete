import { prisma } from './src/lib/prisma';

async function verifyTable() {
  try {
    console.log('Checking if global_offices table exists...');
    const result = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'global_offices'
      );
    `;
    console.log('Table exists:', result);
    
    console.log('\nTrying to query GlobalOffice...');
    const offices = await prisma.globalOffice.findMany();
    console.log('Success! Found', offices.length, 'offices');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyTable();
