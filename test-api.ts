import { prisma } from "./src/lib/prisma"

async function main() {
  console.log('--- API Tester ---')
  
  try {
    console.log('Fetching offices via Prisma...')
    const data = await prisma.globalOffice.findMany({
      include: {
        countries: {
          include: {
            country: true,
          },
        },
      },
    })
    console.log('Successfully fetched offices:', data.length)
  } catch (error: any) {
    console.error('Prisma fetch failed:', error)
    if (error.code) console.error('Error code:', error.code)
    if (error.meta) console.error('Error meta:', error.meta)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
