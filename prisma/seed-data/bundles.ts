import { Prisma } from "@/generated/prisma/client";

/**
 * Bundle configuration type
 */
export interface BundleConfig {
   name: string;
   description: string;
   price: number;
   discountAmount: number;
   templateTitles: string[];
   features: Prisma.ProductFeatureCreateWithoutProductInput[];
   useCases: Prisma.ProductUseCaseCreateWithoutProductInput[];
   instructions: Prisma.ProductInstructionCreateWithoutProductInput[];
}

/**
 * Bundle configurations for seed data
 */
export const bundlesData: BundleConfig[] = [
   {
      name: "Developer Essentials Bundle",
      description:
         "Complete toolkit for developers including code review, SQL generation, and bug reporting templates. Save 30%!",
      price: 19.99,
      discountAmount: 9.98,
      templateTitles: [
         "Code Review Assistant",
         "SQL Query Generator",
         "Bug Report Template",
      ],
      features: [
         {
            icon: "Code2",
            title: "Complete Dev Toolkit",
            description: "Everything you need for modern software development",
            order: 0,
         },
         {
            icon: "GitBranch",
            title: "Code Review Ready",
            description: "Professional templates for code reviews and feedback",
            order: 1,
         },
         {
            icon: "Database",
            title: "SQL Generation",
            description: "Create optimized SQL queries with AI assistance",
            order: 2,
         },
         {
            icon: "Bug",
            title: "Bug Tracking",
            description: "Structured bug reports that developers love",
            order: 3,
         },
      ],
      useCases: [
         {
            category: "Software Development",
            description: "Streamline code reviews and quality assurance",
            tags: ["code-review", "quality", "collaboration"],
            order: 0,
         },
         {
            category: "Database Management",
            description: "Generate complex SQL queries efficiently",
            tags: ["database", "sql", "queries"],
            order: 1,
         },
         {
            category: "Bug Reporting",
            description: "Create detailed, actionable bug reports",
            tags: ["debugging", "testing", "qa"],
            order: 2,
         },
      ],
      instructions: [
         {
            step: 1,
            title: "Choose a Template",
            description: "Select the template that fits your current task",
         },
         {
            step: 2,
            title: "Customize for Your Project",
            description: "Adapt the template to your specific project needs",
         },
         {
            step: 3,
            title: "Generate with AI",
            description: "Use your AI assistant to process the prompt",
         },
         {
            step: 4,
            title: "Integrate Results",
            description: "Apply the output to your development workflow",
         },
      ],
   },
   {
      name: "Content Creator Pro Bundle",
      description:
         "Everything you need for content creation: blog posts, documentation, and professional emails. Save 25%!",
      price: 22.99,
      discountAmount: 6.98,
      templateTitles: [
         "Blog Post Outliner",
         "Technical Documentation Writer",
         "Email Response Generator",
      ],
      features: [
         {
            icon: "FileText",
            title: "Content Creation Suite",
            description: "Complete toolkit for professional content creation",
            order: 0,
         },
         {
            icon: "BookOpen",
            title: "Technical Documentation",
            description: "Create clear, comprehensive technical docs",
            order: 1,
         },
         {
            icon: "Mail",
            title: "Professional Emails",
            description: "Craft polished, effective email responses",
            order: 2,
         },
         {
            icon: "PenTool",
            title: "Blog Writing",
            description: "Structured outlines for engaging blog posts",
            order: 3,
         },
      ],
      useCases: [
         {
            category: "Content Writing",
            description: "Create engaging blog posts and articles",
            tags: ["blogging", "writing", "content"],
            order: 0,
         },
         {
            category: "Documentation",
            description: "Write clear technical documentation",
            tags: ["docs", "technical-writing", "guides"],
            order: 1,
         },
         {
            category: "Communication",
            description: "Professional email responses and correspondence",
            tags: ["email", "communication", "business"],
            order: 2,
         },
      ],
      instructions: [
         {
            step: 1,
            title: "Select Content Type",
            description: "Choose the template for your content needs",
         },
         {
            step: 2,
            title: "Define Your Topic",
            description: "Specify your subject matter and target audience",
         },
         {
            step: 3,
            title: "Generate Content",
            description: "Use AI to create your first draft",
         },
         {
            step: 4,
            title: "Edit and Publish",
            description: "Refine the output and publish your content",
         },
      ],
   },
   {
      name: "Business Productivity Bundle",
      description:
         "Boost your productivity with meeting summaries, user stories, and professional communication templates.",
      price: 21.99,
      discountAmount: 7.98,
      templateTitles: [
         "Meeting Notes Summarizer",
         "User Story Creator",
         "Email Response Generator",
      ],
      features: [
         {
            icon: "Briefcase",
            title: "Business Productivity",
            description: "Essential tools for modern business operations",
            order: 0,
         },
         {
            icon: "Users",
            title: "Meeting Management",
            description: "Transform meeting notes into actionable summaries",
            order: 1,
         },
         {
            icon: "ListTodo",
            title: "User Story Creation",
            description: "Generate clear, comprehensive user stories",
            order: 2,
         },
         {
            icon: "MessageSquare",
            title: "Professional Communication",
            description: "Polished email responses and business correspondence",
            order: 3,
         },
      ],
      useCases: [
         {
            category: "Meeting Management",
            description: "Summarize meetings and extract action items",
            tags: ["meetings", "notes", "productivity"],
            order: 0,
         },
         {
            category: "Agile Development",
            description: "Create well-structured user stories",
            tags: ["agile", "user-stories", "requirements"],
            order: 1,
         },
         {
            category: "Business Communication",
            description: "Professional email templates and responses",
            tags: ["email", "business", "communication"],
            order: 2,
         },
      ],
      instructions: [
         {
            step: 1,
            title: "Choose Your Tool",
            description: "Select the template that matches your task",
         },
         {
            step: 2,
            title: "Input Your Data",
            description: "Provide the necessary context and information",
         },
         {
            step: 3,
            title: "Generate Output",
            description: "Let AI create your structured output",
         },
         {
            step: 4,
            title: "Apply to Work",
            description: "Use the output in your business workflow",
         },
      ],
   },
];
