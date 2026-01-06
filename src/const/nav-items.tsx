import {
  BookOpen,
  Calendar,
  PoundSterling,
  GraduationCap,
  User,
  MapPin,
  Globe2,
  FileText,
} from "lucide-react";

export const navItems = [
  {
    name: "Destination",
    link: "/",
    contents: {
      heading: "Discover a world-class education in the UK.",
      viewAllLink: "/study-uk",
      items: [
        {
          icon: <User size={20} />,
          title: "Why Choose UK",
          description:
            "Discover why the UK is great for both education and culture.",
          href: "/why-choose-uk",
        },
        {
          icon: <BookOpen size={20} />,
          title: "What Can I Study?",
          description: "Explore your options to find your passion.",
          href: "/what-can-i-study",
        },
        {
          icon: <Calendar size={20} />,
          title: "January Intake",
          description: "Find out about courses starting in January.",
          href: "/intakes/january",
        },
        {
          icon: <Calendar size={20} />,
          title: "September Intake",
          description: "Find out about courses starting in September.",
          href: "/intakes/september",
        },
        {
          icon: <PoundSterling size={20} />,
          title: "Cost of Study",
          description:
            "Get insights on tuition, living expenses, and scholarships.",
          href: "/cost-of-study",
        },
        {
          icon: <GraduationCap size={20} />,
          title: "Student Essentials",
          description: "Everything you need to know about studying in the UK.",
          href: "/student-essentials",
        },
      ],
    },
  },
  {
    name: "Universities",
    link: "/universities",
    contents: {
      heading: "Explore top UK universities.",
      viewAllLink: "/universities",
      items: [
        {
          icon: <GraduationCap size={20} />,
          title: "Top Ranked Universities",
          description: "Learn about the best universities in the UK.",
          href: "/universities/top-ranked",
        },
        {
          icon: <MapPin size={20} />,
          title: "Study Locations",
          description: "Find the perfect city for your studies.",
          href: "/universities/locations",
        },
        {
          icon: <Globe2 size={20} />,
          title: "International Students",
          description: "See which universities have the best global support.",
          href: "/universities/international",
        },
      ],
    },
  },
  {
    name: "Find a Course",
    link: "/courses",
    contents: {
      heading: "Find your perfect course in the UK.",
      viewAllLink: "/courses",
      items: [
        {
          icon: <BookOpen size={20} />,
          title: "Undergraduate Courses",
          description: "Explore a wide range of bachelor’s degrees.",
          href: "/courses/undergraduate",
        },
        {
          icon: <BookOpen size={20} />,
          title: "Postgraduate Courses",
          description: "Master’s and PhD opportunities across the UK.",
          href: "/courses/postgraduate",
        },
        {
          icon: <BookOpen size={20} />,
          title: "Foundation Programs",
          description: "Prepare for university study with a foundation year.",
          href: "/courses/foundation",
        },
      ],
    },
  },
  {
    name: "Global Offices",
    link: "/offices",
    contents: {
      heading: "Find our offices around the world.",
      viewAllLink: "/offices",
      items: [
        {
          icon: <MapPin size={20} />,
          title: "UK Office",
          description: "Our headquarters in London.",
          href: "/offices/uk",
        },
        {
          icon: <MapPin size={20} />,
          title: "India Office",
          description: "Connect with our South Asia team.",
          href: "/offices/india",
        },
        {
          icon: <MapPin size={20} />,
          title: "Nigeria Office",
          description: "Meet our representatives in Africa.",
          href: "/offices/nigeria",
        },
      ],
    },
  },
  {
    name: "Blogs",
    link: "/blogs",
  },
  {
    name: "Apply now",
    link: "/apply-now",
  },
];
