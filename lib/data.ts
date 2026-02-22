export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Temporary";
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  category: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp Solutions",
    location: "London, UK",
    type: "Full-time",
    salary: "£80,000 - £100,000",
    description: "We are seeking an experienced Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining scalable software solutions.",
    requirements: [
      "5+ years of experience in software development",
      "Strong proficiency in TypeScript and React",
      "Experience with cloud platforms (AWS/GCP)",
      "Excellent problem-solving skills"
    ],
    postedDate: "2026-01-28",
    category: "Technology"
  },
  {
    id: "2",
    title: "Finance Director",
    company: "Global Investments Ltd",
    location: "Manchester, UK",
    type: "Full-time",
    salary: "£120,000 - £150,000",
    description: "Lead our finance team and drive strategic financial planning for a rapidly growing investment firm.",
    requirements: [
      "10+ years in finance leadership",
      "ACA/ACCA qualified",
      "Experience in investment management",
      "Strong analytical skills"
    ],
    postedDate: "2026-01-27",
    category: "Finance"
  },
  {
    id: "3",
    title: "Marketing Manager",
    company: "Brand Innovations",
    location: "Birmingham, UK",
    type: "Full-time",
    salary: "£55,000 - £65,000",
    description: "Develop and execute marketing strategies to drive brand awareness and customer acquisition.",
    requirements: [
      "5+ years marketing experience",
      "Digital marketing expertise",
      "Team management experience",
      "Data-driven approach"
    ],
    postedDate: "2026-01-26",
    category: "Marketing"
  },
  {
    id: "4",
    title: "HR Business Partner",
    company: "Enterprise Holdings",
    location: "Leeds, UK",
    type: "Full-time",
    salary: "£50,000 - £60,000",
    description: "Partner with business leaders to develop and implement HR strategies that support organizational goals.",
    requirements: [
      "CIPD qualified",
      "Experience in HRBP role",
      "Strong stakeholder management",
      "Change management experience"
    ],
    postedDate: "2026-01-25",
    category: "Human Resources"
  },
  {
    id: "5",
    title: "Project Coordinator",
    company: "Construction Plus",
    location: "Bristol, UK",
    type: "Contract",
    salary: "£35,000 - £42,000",
    description: "Coordinate multiple construction projects, ensuring timely delivery and budget adherence.",
    requirements: [
      "3+ years project coordination",
      "Construction industry experience",
      "Strong organizational skills",
      "Proficiency in project management tools"
    ],
    postedDate: "2026-01-24",
    category: "Construction"
  },
  {
    id: "6",
    title: "Executive Assistant",
    company: "CEO Partners",
    location: "London, UK",
    type: "Full-time",
    salary: "£45,000 - £55,000",
    description: "Provide high-level administrative support to C-suite executives in a fast-paced environment.",
    requirements: [
      "5+ years EA experience",
      "Excellent communication skills",
      "Advanced MS Office skills",
      "Discretion and professionalism"
    ],
    postedDate: "2026-01-23",
    category: "Administration"
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Remote Work in 2026",
    excerpt: "Exploring how hybrid work models are reshaping the modern workplace and what employers need to know.",
    content: "Full article content here...",
    author: "Sarah Mitchell",
    date: "2026-01-28",
    category: "Workplace Trends",
    image: "/blog/remote-work.jpg"
  },
  {
    id: "2",
    title: "Top Skills Employers Are Looking For",
    excerpt: "Discover the most in-demand skills that can help you stand out in today's competitive job market.",
    content: "Full article content here...",
    author: "James Cooper",
    date: "2026-01-25",
    category: "Career Advice",
    image: "/blog/skills.jpg"
  },
  {
    id: "3",
    title: "Navigating Career Transitions Successfully",
    excerpt: "A comprehensive guide to changing careers at any stage of your professional journey.",
    content: "Full article content here...",
    author: "Emma Thompson",
    date: "2026-01-22",
    category: "Career Advice",
    image: "/blog/career-transition.jpg"
  },
  {
    id: "4",
    title: "Building an Inclusive Workplace Culture",
    excerpt: "How organizations can create environments where every employee feels valued and empowered.",
    content: "Full article content here...",
    author: "Michael Chen",
    date: "2026-01-19",
    category: "Workplace Culture",
    image: "/blog/inclusive-culture.jpg"
  },
  {
    id: "5",
    title: "Salary Negotiation Strategies That Work",
    excerpt: "Expert tips on how to confidently negotiate your salary and benefits package.",
    content: "Full article content here...",
    author: "Rachel Adams",
    date: "2026-01-16",
    category: "Career Advice",
    image: "/blog/salary.jpg"
  },
  {
    id: "6",
    title: "The Rise of AI in Recruitment",
    excerpt: "Understanding how artificial intelligence is transforming the hiring process.",
    content: "Full article content here...",
    author: "David Wilson",
    date: "2026-01-13",
    category: "Industry Insights",
    image: "/blog/ai-recruitment.jpg"
  }
];

export const services: Service[] = [
  {
    id: "job-seekers",
    title: "Job Seekers",
    description: "Access exclusive job opportunities and personalized career support to find your perfect role.",
    icon: "user"
  },
  {
    id: "specialist-recruitment",
    title: "Specialist Recruitment",
    description: "Industry-specific recruitment solutions tailored to your sector's unique requirements.",
    icon: "target"
  },
  {
    id: "temporary-contract",
    title: "Temporary & Contract",
    description: "Flexible staffing solutions for project-based work and interim positions.",
    icon: "clock"
  },
  {
    id: "executive-search",
    title: "Executive Search",
    description: "Confidential executive recruitment for senior leadership and board-level positions.",
    icon: "briefcase"
  },
  {
    id: "career-transition",
    title: "Career Transition",
    description: "Comprehensive outplacement services and career coaching for professionals in transition.",
    icon: "arrow-right"
  },
  {
    id: "career-management",
    title: "Career Management",
    description: "Strategic career planning and development programs for long-term professional growth.",
    icon: "trending-up"
  }
];

export const employeeCountOptions = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+"
];
