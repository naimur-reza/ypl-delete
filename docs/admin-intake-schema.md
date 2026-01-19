# Admin Panel Schema - Intake Page Management

## Overview

This document outlines the database schema and admin interface requirements for managing intake pages in the NWC Education CMS.

## Database Schema

### IntakePage Model

```sql
model IntakePage {
  id                   String              @id @default(cuid())
  destinationId        String
  intake               IntakeMonth

  // Country/Global Filtering
  countryId            String?             // null = global, specific country = country-specific
  isGlobal             Boolean             @default(false) // true = global intake page

  // Basic Content
  title                String
  slug                 String              // e.g., "may-intake", "september-intake"
  description          String?

  // Hero Section
  heroTitle            String?
  heroSubtitle         String?
  heroMedia            String?             // image or video URL
  heroMediaType        MediaType?          @default(IMAGE) // IMAGE or VIDEO
  heroCTALabel         String?             @default("Apply Now")
  heroCTAUrl           String?             @default("/apply-now")

  // Why Choose Section
  whyChooseTitle       String?
  whyChooseDescription String?

  // Eligibility Section
  eligibility          String?             // JSON form configuration
  eligibilityEnabled   Boolean             @default(true)

  // Timeline & Countdown
  timelineJson         Json?               // Application timeline steps
  targetDate           DateTime?           // Countdown target date
  timelineEnabled      Boolean             @default(true)

  // Top Universities
  topUniversitiesJson  Json?               // Array of university data
  universitiesEnabled  Boolean             @default(true)

  // How We Help Section
  howWeHelpJson        Json?               // Array of help steps
  howWeHelpEnabled     Boolean             @default(true)

  // Section Visibility Toggles
  showHeroSection      Boolean             @default(true)
  showWhyChoose        Boolean             @default(true)
  showEligibility      Boolean             @default(true)
  showUniversities     Boolean             @default(true)
  showTimeline         Boolean             @default(true)
  showHowWeHelp        Boolean             @default(true)
  showStudentReviews   Boolean             @default(true)
  showGoogleReviews    Boolean             @default(true)
  showFAQs             Boolean             @default(true)
  showRepresentatives  Boolean             @default(true)
  showCTA              Boolean             @default(true)

  // SEO
  metaTitle            String?
  metaDescription      String?
  metaKeywords         String?
  canonicalUrl         String?

  // Metadata
  createdAt            DateTime            @default(now())
  updatedAt            DateTime            @updatedAt
  status               ContentStatus       @default(DRAFT)

  // Relations
  destination          Destination         @relation(fields: [destinationId], references: [id])
  country              Country?            @relation(fields: [countryId], references: [id])
  intakePageBenefits   IntakePageBenefit[]
  faqs                 FAQIntakePage[]

  @@unique([destinationId, intake, countryId]) // Unique per destination+intake+country
  @@unique([destinationId, intake, isGlobal])   // Unique per destination+intake+global
  @@index([status])
  @@index([destinationId, intake])
  @@index([countryId, isGlobal])
}
```

### IntakePageBenefit Model

```sql
model IntakePageBenefit {
  id           String     @id @default(cuid())
  intakePageId String
  title        String
  description  String?
  icon         String?    // Lucide icon name or custom icon URL
  sortOrder    Int        @default(0)
  isActive     Boolean    @default(true)
  intakePage   IntakePage @relation(fields: [intakePageId], references: [id], onDelete: Cascade)

  @@index([intakePageId, sortOrder])
}
```

## Admin Panel Interface Design

### 1. Intake Page List View

**Route**: `/admin/dashboard/intakes`

**Features**:

- **Search & Filter**: By destination, intake month, country, status
- **Quick Actions**: Edit, Duplicate, Delete, Preview
- **Bulk Actions**: Publish/Unpublish, Delete
- **Columns**: Title, Destination, Intake, Country/Global, Status, Updated At

**Table Structure**:
| Title | Destination | Intake | Country/Global | Status | Updated | Actions |
|-------|-------------|---------|----------------|--------|---------|---------|
| May Intake 2024 | UK | MAY | Global | Published | 2 days ago | Edit |
| September Intake 2024 | USA | SEPTEMBER | Bangladesh | Draft | 1 week ago | Edit |

### 2. Create/Edit Intake Page

**Route**: `/admin/dashboard/intakes/[id]` (edit) or `/admin/dashboard/intakes/create`

#### Form Sections:

##### Basic Information

- **Destination**: Dropdown selection
- **Intake Month**: Dropdown (JANUARY, MAY, SEPTEMBER)
- **Scope**: Radio buttons (Global / Country-Specific)
- **Country**: Dropdown (if country-specific)
- **Title**: Text input
- **Slug**: Auto-generated from title, editable
- **Description**: Rich text editor
- **Status**: Dropdown (Draft / Active)

##### Hero Section

- **Title**: Text input
- **Subtitle**: Rich text editor
- **Media Type**: Radio buttons (Image / Video)
- **Media URL**: File uploader or URL input
- **CTA Label**: Text input
- **CTA URL**: URL input

##### Why Choose Section

- **Section Title**: Text input
- **Section Description**: Rich text editor
- **Benefits**: Repeater component with:
  - Title
  - Description
  - Icon (Lucide icon selector)
  - Sort order
  - Active toggle

##### Eligibility Section

- **Enable Section**: Toggle
- **Form Configuration**: JSON editor or visual form builder

##### Timeline Section

- **Enable Section**: Toggle
- **Target Date**: Date picker
- **Timeline Steps**: Repeater component with:
  - Step Title
  - Description
  - Date
  - Sort order

##### Top Universities

- **Enable Section**: Toggle
- **Universities**: Multi-select from existing universities or add custom

##### How We Help Section

- **Enable Section**: Toggle
- **Help Steps**: Repeater component with:
  - Title
  - Description
  - Icon (Lucide icon selector)
  - Sort order

##### Section Visibility

- **Checkboxes** for each section:
  - [ ] Hero Section
  - [ ] Why Choose
  - [ ] Eligibility
  - [ ] Universities
  - [ ] Timeline
  - [ ] How We Help
  - [ ] Student Reviews
  - [ ] Google Reviews
  - [ ] FAQs
  - [ ] Representatives
  - [ ] CTA

##### SEO Settings

- **Meta Title**: Text input
- **Meta Description**: Textarea
- **Meta Keywords**: Tags input
- **Canonical URL**: URL input

### 3. FAQ Management

**Route**: `/admin/dashboard/intakes/[id]/faqs`

**Features**:

- **Add Existing FAQs**: Search and select from FAQ library
- **Create New FAQ**: Inline form
- **Reorder**: Drag and drop
- **Remove**: Delete button

### 4. Preview Mode

**Features**:

- **Live Preview**: See how the page looks
- **Device Preview**: Desktop, Tablet, Mobile views
- **Country Preview**: View as different countries
- **Share Preview**: Generate shareable preview link

### 5. Bulk Operations

**Features**:

- **Import**: CSV/JSON import for multiple intake pages
- **Export**: Export intake pages data
- **Duplicate**: Create copies with modifications
- **Bulk Publish/Unpublish**: Update multiple pages at once

## API Endpoints

### GET /api/admin/intakes

- Get list of intake pages with filtering
- Query params: `destination`, `intake`, `country`, `status`, `page`, `limit`

### GET /api/admin/intakes/[id]

- Get single intake page details

### POST /api/admin/intakes

- Create new intake page

### PUT /api/admin/intakes/[id]

- Update intake page

### DELETE /api/admin/intakes/[id]

- Delete intake page

### POST /api/admin/intakes/[id]/duplicate

- Duplicate intake page

### POST /api/admin/intakes/bulk

- Bulk operations (publish, unpublish, delete)

## Validation Rules

### General

- **Title**: Required, max 200 characters
- **Slug**: Required, unique per destination+intake+country, alphanumeric with hyphens
- **Description**: Optional, max 1000 characters

### Hero Section

- **Media URL**: Required if hero section enabled, must be valid URL
- **CTA URL**: Optional, must be valid URL if provided

### Benefits

- **Title**: Required, max 100 characters
- **Description**: Optional, max 500 characters
- **Icon**: Optional, must be valid Lucide icon name

### SEO

- **Meta Title**: Optional, max 60 characters
- **Meta Description**: Optional, max 160 characters
- **Meta Keywords**: Optional, max 10 keywords

## Permissions

### Roles

- **Super Admin**: Full access to all intake pages
- **Country Admin**: Access only to country-specific intake pages for assigned countries
- **Content Editor**: Can edit content but cannot change status or delete
- **Viewer**: Read-only access

### Access Control

- Country-specific pages visible only to assigned country admins
- Global pages visible to all admins
- Audit trail for all changes

## Performance Considerations

### Caching

- Cache intake pages for 24 hours
- Clear cache on update/delete
- CDN for media files

### Database Optimization

- Indexes on frequently queried fields
- Separate table for benefits (already implemented)
- Lazy loading for related data

### Media Management

- Image optimization and resizing
- Video transcoding for web
- CDN integration

## Future Enhancements

### A/B Testing

- Multiple hero sections
- Different CTA variations
- Performance tracking

### Personalization

- Dynamic content based on user location
- Personalized university recommendations
- Custom form fields

### Analytics

- Page performance tracking
- Conversion funnel analysis
- User behavior insights
