# Prisma Schema Organization

This project uses Prisma's `prismaSchemaFolder` preview feature to organize the schema into multiple files based on features. This makes it easier to manage and maintain the database schema.

## File Structure

```
prisma/
├── schema/
│   ├── schema.prisma             # Main config (generator, datasource, enums)
│   ├── user.prisma               # User authentication
│   ├── location.prisma           # Countries, Destinations, GlobalOffice
│   ├── university.prisma         # University and UniversityDetail
│   ├── course.prisma             # Courses, Intakes, IntakePage
│   ├── scholarship.prisma        # Scholarships
│   ├── event.prisma              # Events and EventMedia
│   ├── blog.prisma               # Blog/Articles
│   ├── faq.prisma                # FAQs
│   ├── review.prisma             # Reviews and Testimonials
│   ├── representative-video.prisma # Representative Videos
│   ├── content.prisma            # Service, Accreditation, Career
│   ├── lead.prisma               # Lead, OfferRequest, Recommendation
│   └── relations.prisma          # All junction tables
└── schema.prisma (legacy - can be removed)
```

## Features by File

### Core Features
- **user.prisma**: User management and authentication
- **location.prisma**: Geographic data (countries, destinations, offices)
- **university.prisma**: University profiles and details
- **course.prisma**: Course catalog and intakes
- **scholarship.prisma**: Financial aid and scholarships
- **event.prisma**: Events, fairs, webinars
- **blog.prisma**: Content and articles
- **faq.prisma**: Frequently asked questions
- **review.prisma**: Student and GMB reviews
- **representative-video.prisma**: Video testimonials
- **content.prisma**: Additional content (services, careers, accreditations)
- **lead.prisma**: Lead generation and recommendations
- **relations.prisma**: All many-to-many junction tables

## Commands

### Generate Prisma Client
```bash
npx prisma generate
```

### Run Migrations
```bash
npx prisma migrate dev --name your_migration_name
```

### Reset Database
```bash
npx prisma migrate reset
```

### Studio
```bash
npx prisma studio
```

## Notes

- The `prismaSchemaFolder` preview feature is enabled in `schema/schema.prisma`
- All schema files are located in the `prisma/schema/` directory
- The old `prisma/schema.prisma` file can be safely removed after migration
- Each file is self-contained with its models and can be edited independently
- All relationships are properly maintained across files

## Migration Steps

1. ✅ Enable `prismaSchemaFolder` preview feature
2. ✅ Split schema into feature-based files
3. ✅ Organize junction tables in `relations.prisma`
4. ⏳ Run `npx prisma generate` to regenerate the client
5. ⏳ Test the application to ensure everything works
6. ⏳ Remove old `prisma/schema.prisma` file (optional)
