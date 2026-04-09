/* Seed script – run with: npx tsx scripts/seed.ts */
import fs from "fs";
import path from "path";

// Load .env from project root (no dotenv dependency needed)
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const val = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../lib/models/user";
import Career from "../lib/models/career";
import Department from "../lib/models/department";
import Role from "../lib/models/role";
import Service from "../lib/models/service";
import Hero from "../lib/models/hero";
import Team from "../lib/models/team";
import Event from "../lib/models/event";
import SalaryGuideLead from "../lib/models/salary-guide-lead";
import EventLead from "../lib/models/event-lead";
import Application from "../lib/models/application";
import Activity from "../lib/models/activity";
import Insight from "../lib/models/insight";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ypl";

async function seed() {
  console.log(
    "Connecting to:",
    MONGODB_URI.replace(/\/\/[^@]+@/, "//<credentials>@"),
  );
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // 1. Reset Database
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
    // Drop all indexes (except _id) to avoid stale unique constraints
    try {
      await collections[key].dropIndexes();
    } catch (e) {
      // ignore if no indexes
    }
    console.log(`Cleared collection: ${key}`);
  }

  // 2. Seed Users
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const superadmin = await User.create({
    name: "Super Admin",
    email: "admin@ypl.com",
    password: hashedPassword,
    role: "superadmin",
    isActive: true,
  });
  console.log("Created superadmin: admin@ypl.com / admin123");

  await User.create([
    {
      name: "John Manager",
      email: "manager@ypl.com",
      password: hashedPassword,
      role: "manager",
      isActive: true,
    },
    {
      name: "Jane Admin",
      email: "jane@ypl.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    },
  ]);

  // 3. Departments & Roles
  const depts = await Department.create([
    { name: "Information Technology", slug: "it", order: 1 },
    { name: "Human Resources", slug: "hr", order: 2 },
    { name: "Finance & Accounting", slug: "finance", order: 3 },
    { name: "Marketing & Sales", slug: "marketing", order: 4 },
  ]);

  const roles = await Role.create([
    {
      name: "Software Engineer",
      slug: "software-engineer",
      departmentId: depts[0]._id,
      order: 1,
    },
    {
      name: "System Architect",
      slug: "system-architect",
      departmentId: depts[0]._id,
      order: 2,
    },
    {
      name: "HR Manager",
      slug: "hr-manager",
      departmentId: depts[1]._id,
      order: 1,
    },
    {
      name: "Financial Controller",
      slug: "financial-controller",
      departmentId: depts[2]._id,
      order: 1,
    },
  ]);

  // 4. Careers
  await Career.create([
    {
      title: "Senior Full Stack Developer",
      slug: "senior-full-stack-developer",
      company: "InnovateTech Global",
      description:
        "Join a high-performance team building the next generation of SaaS solutions. Experience with React, Node.js, and Cloud Infrastructure is essential.",
      requirements: [
        "5+ years experience",
        "Strong React/Node skills",
        "AWS Certification preferred",
      ],
      location: "London, UK (Hybrid)",
      type: "Full-time",
      salary: "£85,000 - £110,000",
      category: "Technology",
      department: "IT",
      isActive: true,
    },
    {
      title: "Head of Talent Acquisition",
      slug: "head-of-talent-acquisition",
      company: "FastScale Scaleup",
      description:
        "Lead our recruitment strategy and build a world-class team. You will be responsible for end-to-end hiring and employer branding.",
      requirements: [
        "8+ years in recruitment",
        "Proven leadership experience",
        "Strong stakeholder management",
      ],
      location: "Manchester, UK",
      type: "Full-time",
      salary: "£75,000 - £90,000",
      category: "Human Resources",
      department: "HR",
      isActive: true,
    },
    {
      title: "Chief Financial Officer",
      slug: "chief-financial-officer",
      company: "Wealth Management Group",
      description:
        "Strategic leadership role overseeing all financial aspects of a growing wealth management firm.",
      requirements: [
        "Qualified Accountant (ACA/ACCA)",
        "28+ years experience",
        "Board-level experience",
      ],
      location: "Birmingham, UK",
      type: "Full-time",
      salary: "£130,000 - £160,000",
      category: "Finance",
      department: "Finance",
      isActive: true,
    },
  ]);

  // 5. Services
  await Service.create([
    {
      title: "Permanent Placement",
      slug: "permanent-placement",
      description:
        "Identifying and securing the best talent for your long-term success.",
      icon: "users",
      features: [
        "Candidate Screening",
        "Reference Checks",
        "Onboarding Support",
      ],
      order: 1,
    },
    {
      title: "Executive Search",
      slug: "executive-search",
      description:
        "Confidential headhunting for leadership and C-suite positions.",
      icon: "target",
      features: ["Market Mapping", "Competency Interviews", "Board Advisory"],
      order: 2,
    },
    {
      title: "Interim Solutions",
      slug: "interim-solutions",
      description:
        "Flexible, project-based talent to bridge gaps or drive transformation.",
      icon: "clock",
      features: [
        "Rapid Deployment",
        "Experienced Consultants",
        "Short-term Experts",
      ],
      order: 3,
    },
  ]);

  // 6. Hero Slider
  await Hero.create([
    {
      badgeText: "Global Talent Partners",
      title: "Excellence in",
      highlightText: "Team Building",
      description:
        "We connect visionary companies with world-class professionals who drive innovation.",
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80",
      primaryBtnText: "Explore Roles",
      primaryBtnLink: "/jobs",
      secondaryBtnText: "Contact Us",
      secondaryBtnLink: "/contact",
      order: 1,
    },
    {
      badgeText: "Strategic Recruitment",
      title: "Unlock Your",
      highlightText: "True Potential",
      description:
        "Discover exclusive opportunities that align with your career ambitions and expertise.",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
      primaryBtnText: "View Jobs",
      primaryBtnLink: "/jobs",
      order: 2,
    },
  ]);

  // 7. Team
  await Team.create([
    {
      name: "Sarah Mitchell",
      role: "Founder & CEO",
      bio: "With over 20 years in international recruitment, Sarah has built teams for some of the world's leading tech firms.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      order: 1,
    },
    {
      name: "James Cooper",
      role: "Head of Technology",
      bio: "James is an expert in software engineering talent, focusing on CTO and VP Engineering placements.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
      order: 2,
    },
  ]);

  // 8. Events
  const events = await Event.create([
    {
      title: "Modern Recruitment Strategies 2026",
      description:
        "A comprehensive webinar on how AI and automation are reshaping the talent acquisition landscape. Learn from industry leaders about the future of hiring.",
      startDate: new Date("2026-03-15T14:00:00Z"),
      endDate: new Date("2026-03-15T16:00:00Z"),
      location: "Online (Zoom)",
      type: "webinar",
      createdBy: superadmin._id.toString(),
      isActive: true,
      imageUrl:
        "https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?w=800&q=80",
      capacity: 500,
      tags: ["Recruitment", "AI", "Future of Work"],
    },
  ]);

  // 9. Mock Leads & Applications
  const firstJob = await Career.findOne({
    slug: "senior-full-stack-developer",
  });
  if (firstJob) {
    await Application.create({
      career: firstJob._id,
      fullName: "Alice Developer",
      email: "alice@example.com",
      phone: "+44 7700 900000",
      cvUrl: "https://example.com/cv.pdf",
      coverLetter:
        "I am very excited about this role! I have 6 years of experience in React and Node.js.",
      status: "new",
    });
  }

  await SalaryGuideLead.create([
    {
      fullName: "Bob Finance",
      email: "bob@finance.com",
      mobileNumber: "+44 7700 900111",
      currentOrganization: "Finance Pros Ltd",
      currentPosition: "Finance Manager",
      industry: "Finance",
      totalExperience: "10+ years",
      location: "London, UK",
      message:
        "I am interested in your 2026 salary benchmarks for the London area.",
      status: "New",
    },
  ]);

  await EventLead.create({
    eventId: events[0]._id,
    fullName: "Charlie Event",
    email: "charlie@webinar.com",
    mobileNumber: "+44 7700 900222",
    organization: "Event Planners Inc",
    designation: "Event Coordinator",
    status: "pending",
  });

  // 10. Activity Logs
  await Activity.create([
    {
      userId: superadmin._id.toString(),
      userName: "Super Admin",
      userEmail: "admin@ypl.com",
      action: "create",
      entityType: "Career",
      entityId: firstJob?._id.toString() || "system",
      entityName: "Senior Full Stack Developer",
      description: "Seeded initial career data",
    },
    {
      userId: superadmin._id.toString(),
      userName: "Super Admin",
      userEmail: "admin@ypl.com",
      action: "update",
      entityType: "Hero",
      entityId: "system",
      description: "Updated hero slides for the new season",
    },
  ]);

  // 11. Insights (Blog Posts)
  const insights = await Insight.create([
    {
      title: "The Future of Recruitment: AI and Human Intelligence",
      slug: "future-of-recruitment-ai-human-intelligence",
      excerpt:
        "Exploring the delicate balance between automation and the human touch in modern talent acquisition.",
      content:
        "As we move further into 2026, the recruitment landscape is undergoing a seismic shift. Artificial Intelligence is no longer a futuristic concept but a daily tool for talent acquisition professionals. From automated resume screening to AI-driven candidate engagement, technology is making the hiring process faster and more efficient.\n\nHowever, the 'human' in Human Resources remains more critical than ever. While AI can process data and identify patterns, it cannot replicate the intuition, empathy, and cultural assessment that a human recruiter brings to the table.\n\nKey trends to watch:\n1. Hyper-personalized candidate experiences\n2. Bias-reduction algorithms\n3. Skills-based hiring over traditional credentials\n4. Virtual Reality office tours\n\nThe most successful firms will be those that leverage AI to handle the volume while freeing up recruiters to build deep, meaningful relationships with candidates.",
      author: "Sarah Mitchell",
      category: "Industry Insights",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
      order: 1,
      isActive: true,
      publishedAt: new Date("2026-02-15"),
    },
    {
      title: "Top 10 Soft Skills for 2026 Workplace",
      slug: "top-10-soft-skills-2026",
      excerpt:
        "Technical skills get you the interview, but soft skills get you the job and the promotion. Learn which ones matter most.",
      content:
        "In an increasingly automated world, the skills that make us uniquely human are becoming our greatest professional assets. At YPL, we've analyzed thousands of job descriptions from the past year to identify the 'power skills' that employers are prioritizing.\n\n1. Emotional Intelligence (EQ)\n2. Adaptability & Cognitive Flexibility\n3. Critical Thinking\n4. Collaborative Problem Solving\n5. Digital Literacy\n6. Purpose-Driven Leadership\n7. Cross-Cultural Competency\n8. Analytical Thinking\n9. Active Listening\n10. Resilience\n\nDeveloping these skills requires more than just a certificate; it requires practice, feedback, and a commitment to lifelong learning.",
      author: "James Cooper",
      category: "Career Advice",
      image:
        "https://images.unsplash.com/photo-1521791136364-798a7bc0d262?w=800&q=80",
      order: 2,
      isActive: true,
      publishedAt: new Date("2026-02-20"),
    },
    {
      title: "Building a High-Performance Remote Culture",
      slug: "building-high-performance-remote-culture",
      excerpt:
        "Distance shouldn't be a barrier to excellence. Discover how to foster innovation and accountability in distributed teams.",
      content:
        "The debate over remote vs. office has evolved into a focus on performance and culture, regardless of location. High-performing organizations aren't just 'allowing' remote work; they are designing their entire operations around it.\n\nCulture is what happens when no one is looking. In a remote environment, this means building trust through transparency and clear expectations.\n\nStrategies for success:\n- Asynchronous communication by default\n- Outcome-based performance tracking\n- Virtual 'water cooler' moments that aren't forced\n- Regular in-person retreats for strategic bonding\n\nRemember, a great remote culture is built on intentionality, not accidental collisions in a hallway.",
      author: "Emma Wilson",
      category: "Workplace Culture",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
      order: 3,
      isActive: true,
      publishedAt: new Date("2026-02-21"),
    },
  ]);

  await mongoose.disconnect();
  console.log("Seeding process completed successfully!");
}

seed().catch(console.error);
