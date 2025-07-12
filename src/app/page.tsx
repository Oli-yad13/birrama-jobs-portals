'use client';
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { uploadFile } from '../../utils/uploadFile';
import { supabase } from '../../lib/supabaseClient';
import { sendConfirmationEmail } from '../../utils/sendConfirmationEmail';
import FullTimeApplicationForm from './FullTimeApplicationForm';
import FellowshipApplicationForm from './FellowshipApplicationForm';
import type { FellowshipFormState } from './FellowshipApplicationForm';

declare global {
  interface Window {
    UnicornStudio?: unknown;
  }
}

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#232323] text-white flex items-center justify-between px-6 py-4 border-b-2 border-black">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link href="/" className="relative w-32 h-20 flex items-center" style={{ overflow: 'visible' }}>
          <Image
            src="/birrama-logo.svg" // TODO: Replace with actual Birrama logo file if available
            alt="Birrama Logo"
            width={32}
            height={32}
            priority
            style={{
              marginTop: '-1.2rem',
              marginLeft: '-0.5rem',
              height: '5rem',
              width: 'auto',
              objectFit: 'contain',
              zIndex: 10,
              pointerEvents: 'auto',
            }}
          />
        </Link>
      </div>
    </nav>
  );
}

// MarqueeText component for smooth, seamless looping
function MarqueeText() {
  return (
    <div className="w-full z-20 overflow-visible">
      <div className="relative w-full mx-auto flex flex-col items-center justify-center min-w-0 mt-2" style={{ minHeight: 0 }}>
        <span className="font-extrabold text-black tracking-tight uppercase text-3xl sm:text-5xl md:text-6xl text-center">
          Birrama Venture Studio
        </span>
        <span className="font-bold text-black tracking-tight uppercase text-lg sm:text-2xl md:text-3xl mt-2 text-center">
          Talent Acquisition
        </span>
      </div>
    </div>
  );
}

// App component
export default function Home() {
  return (
    <main className="bg-[#FCF7F8] min-h-screen overflow-x-hidden">
      <NavBar />
      {/* Animated Hero Section */}
      <section
        className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] pt-24 flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #eaf6fb 0%, #f7fafc 60%, #F6F6ED 100%)",
          boxShadow: "0 8px 24px -8px rgba(0,0,0,0.04)"
        }}
      >
        {/* More prominent animated background shapes */}
        <motion.div
          className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
          initial={{}}
          animate={{}}
        >
          <motion.div
            className="w-[60vw] h-[40vw] max-h-[350px] bg-[#B6E3E3] rounded-full blur-3xl opacity-50 absolute -left-20 -top-20"
            animate={{ scale: [1, 1.15, 1], x: [0, 40, 0], y: [0, -40, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
          />
          <motion.div
            className="w-[50vw] h-[30vw] max-h-[250px] bg-[#B6E3E3] rounded-full blur-3xl opacity-40 absolute -right-20 -bottom-20"
            animate={{ scale: [1, 1.1, 1], x: [0, -40, 0], y: [0, 40, 0] }}
            transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
          />
        </motion.div>
        {/* Infinite seamless marquee sliding text at the bottom */}
        <div className="z-10 w-full flex flex-col items-center text-center">
          <MarqueeText />
        </div>
      </section>

      {/* Our Featured Work Section (full-screen, punchy, left-aligned, seamless) */}
      <section className="w-full min-h-screen bg-[#F6F6ED] flex flex-col pt-24">
        {/* Section Title */}
        <div className="w-full flex flex-col items-start pl-4 sm:pl-12 mt-4 mb-4">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-light text-black flex flex-wrap items-end gap-2 sm:gap-4 w-full break-words">
            <span className="italic font-serif font-bold">featured</span>
            <span className="font-black">Roles</span>
          </h2>
          <div className="uppercase text-xs md:text-base tracking-widest text-black/60 mt-2">
            GIVING YOU THE UNFAIR ADVANTAGE
          </div>
        </div>
        {/* Gallery Container for equal side gaps */}
        <div className="w-full px-4 md:px-8 flex flex-col gap-8">
          {/* Big Hero Gallery Card (top, full-width, now below heading) */}
          <BirramaJobBox />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-[#F6F6ED] pt-24 pb-8 flex flex-col items-center justify-center border-t border-black/10">
        {/* Bottom: Huge Company Name */}
        <div className="w-full text-center">
          <span className="text-[10vw] md:text-[7vw] font-black uppercase text-black leading-none tracking-tight block">BIRRAMA<span className="align-super text-3xl md:text-5xl">©</span></span>
        </div>
      </footer>
    </main>
  );
}

function BirramaJobBox() {
  const [step, setStep] = useState<'role' | 'job' | 'desc' | 'self' | 'recommend' | 'fulltimejob'>('role');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FellowshipFormState>({
    name: '',
    email: '',
    phone: '',
    cv: null,
    answers: Array(13).fill(''),
    linkedin: '',
    education: '',
    major: '',
    experience: '',
    interest: '',
    portfolio: '',
    other: '',
    sales_experience: '',
    coverletter: null,
    education_fulltime: '',
    answers_fulltime: Array(13).fill(''),
  });
  const [selectedFellowshipJob, setSelectedFellowshipJob] = useState<number | null>(null);
  const [selectedFulltimeJob, setSelectedFulltimeJob] = useState<number | null>(null);
  // 1. Add loading state to BirramaJobBox
  const [loading, setLoading] = useState(false);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Add modal close handler for click outside
  function handleModalClick(e: React.MouseEvent<HTMLDivElement>) {
    if (modalRef.current && e.target === modalRef.current) {
      setExpandedDescription(null);
    }
  }

  // Job data (expandable for more jobs/roles)
  const jobs = {
    fellowship: [
      {
        title: 'Venture Data Analysis & Insight Fellow',
        description: `Job Title: Venture Data Analysis & Insight Fellow\nLocation: Addis Ababa, Ethiopia\nDuration: 2 - 3 months\nReporting To: Program Manager, Birrama Venture Studio\nContract Type: Full Time \nAbout Birrama Venture Studio\nBirrama is a pioneering Pan-African Venture Studio committed to revolutionizing Africa's consumption ecosystem. Unlike traditional venture capital firms, we internally conceive, launch, and scale market-leading companies that address critical challenges across high-potential sectors such as agriculture, healthcare, financial inclusion, digital commerce, electric mobility, sustainable manufacturing, and more. Our portfolio includes transformative ventures like HuluCares, Lanchi, Tena Sabi, IRIF, ID-NET, Keteme, Kovu, I Meat, KeshKesh and TechFarm Youth. We act as an institutional co-founder, providing strategic guidance, shared resources, unparalleled market access, and a relentless focus on both financial and impact metrics.\nAbout the Role: Data Analytics & Insights Fellow\nWe are seeking a driven and analytical Data Analytics & Insights Fellow to join the Birrama team. This dynamic role offers a unique opportunity to gain hands-on experience by supporting data analysis initiatives across Birrama's entire portfolio of innovative companies. You will contribute directly to extracting valuable insights from data, supporting strategic decision-making, and learning the intricacies of data-driven growth in diverse African markets.\nThis fellowship is ideal for a proactive individual looking to immerse themselves in the fast-paced environment of a venture studio, learn from experienced data professionals, and make a tangible impact on ground-breaking projects.\nKey Responsibilities\nUnder the guidance of relevant data leads and venture teams, you will:\nData Collection & Organization: Assist in gathering, cleaning, and organizing data from various sources across Birrama's portfolio companies (e.g., sales, operations, user behavior, market trends).\nData Analysis Support: Conduct basic data analysis using spreadsheets or analytical tools to identify patterns, trends, and anomalies.\nReport & Dashboard Assistance: Help in preparing data visualizations, reports, and dashboards to present key findings and insights to internal teams.\nPerformance Monitoring: Support the tracking of key performance indicators (KPIs) for individual ventures, helping to measure progress and identify areas for optimization.\nMarket Research Support: Assist in analyzing market data and competitive intelligence to provide insights that inform business strategies.\nProcess Improvement: Contribute to identifying opportunities for automating data collection processes and improving data quality.\nDocumentation: Help document data processes, definitions, and analysis methodologies.\nCross-Functional Collaboration: Work collaboratively with marketing, sales, product, and operations teams to understand their data needs and provide relevant analytical support.\nQualifications\nCurrently pursuing or recently completed a Bachelor's degree in Data Science, Statistics, Mathematics, Economics, Computer Science, Business Analytics, or a related quantitative field.\nA strong interest in data analysis, business intelligence, and the African startup/venture ecosystem.\nBasic proficiency in data analysis tools such as Microsoft Excel, Google Sheets, or introductory knowledge of SQL, Python (Pandas), or R.\nAbility to work with datasets, identify patterns, and draw initial conclusions.\nExcellent attention to detail and strong organizational skills.\nGood written and verbal communication skills in English and Amharic, with the ability to articulate findings clearly.\nProactive, self-motivated, and eager to learn in a dynamic environment.\nAbility to work both independently and collaboratively within a team.\nWhat We Offer\nAn immersive experience within a pioneering Pan-African Venture Studio.\nDirect involvement in data analysis for a diverse portfolio of high-impact ventures across various sectors.\nMentorship and professional development opportunities from experienced data scientists and business leaders.\nA vibrant, collaborative, and inclusive work environment where data-driven insights are highly valued.\nThe chance to contribute to meaningful work that drives sustainable economic and social impact across Africa.\nStipend/compensation details will be discussed during the interview process.`,
        form: 'data',
      },
      {
        title: 'Venture Marketing and Digital Growth Fellow',
        description: `Job Title: Venture Marketing and Digital Growth Fellow\nLocation: Addis Ababa, Ethiopia\nDuration: 2 - 3 months\nReporting To: Program Manager, Birrama Venture Studio\nContract Type: Full Time\n\nAbout Birrama Venture Studio\nBirrama is a pioneering Pan-African Venture Studio committed to revolutionizing Africa's consumption ecosystem. Unlike traditional venture capital firms, we internally conceive, launch, and scale market-leading companies that address critical challenges across high-potential sectors such as agriculture, healthcare, financial inclusion, digital commerce, electric mobility, sustainable manufacturing, and more. Our portfolio includes transformative ventures like HuluCares, Lanchi, Tena Sabi, IRIF, ID-NET, Keteme, Kovu, I Meat, KeshKesh and TechFarm Youth. We act as an institutional co-founder, providing strategic guidance, shared resources, unparalleled market access, and a relentless focus on both financial and impact metrics.\n\nAbout the Role\nWe are seeking a creative and digitally savvy Venture Marketing and Digital Growth to join the Birrama team. This specialized role offers a unique opportunity to immerse yourself in the world of social media strategy, content creation, and community engagement for Birrama and its diverse portfolio companies. You will play a key role in shaping our online voice, growing our digital communities, and amplifying the stories of our impactful ventures across various social platforms.\nThis fellowship is ideal for a proactive individual passionate about digital storytelling, eager to learn cutting-edge social media techniques, and ready to contribute to a mission-driven organization.\n\nKey Responsibilities\n- Content Creation & Curation: Assist in drafting, designing, and curating engaging visual and written content (e.g., graphics, short videos, blog snippets, social media posts) for various platforms including LinkedIn, X (Twitter), Instagram, and Facebook.\n- Social Media Management: Support the daily management of social media channels, including scheduling posts, monitoring trends, and ensuring brand consistency.\n- Community Engagement: Help monitor comments and messages on social media, respond to basic inquiries, and engage with our online communities to foster interaction.\n- Digital Marketing Support: Assist in implementing email marketing campaigns, updating website content, and preparing materials for online events or webinars.\n- Social Listening & Research: Conduct basic research on social media trends, competitor activities, and relevant industry news to identify content opportunities.\n- Performance Tracking: Collect and organize basic social media and website performance data (e.g., engagement rates, follower growth), and assist in preparing simple reports.\n- Administrative Support: Provide general administrative assistance related to content calendars, digital asset organization, and marketing documentation.\n\nQualifications\n- Currently enrolled in or recently completed a Bachelor's degree program in Marketing, Communications, Digital Media, Journalism, Public Relations, or a related field.\n- Strong interest in digital marketing, content creation, and social media management.\n- Basic familiarity with various social media platforms (LinkedIn, X (Twitter), Instagram, Facebook).\n- Creativity and a keen eye for visual aesthetics; basic graphic design skills (e.g., Canva) are a plus.\n- Excellent written and verbal communication skills in English and Amharic.\n- Ability to work independently and collaboratively in a fast-paced environment.\n- Proactive, highly organized, and eager to learn\n\nWhat We Offer\n- An immersive and practical learning experience within a pioneering Pan-African Venture Studio.\n- Hands-on involvement in real-world marketing and social media initiatives.\n- Mentorship from experienced professionals in the digital marketing and venture capital space.\n- A vibrant, collaborative, and inclusive work environment in the heart of Addis Ababa.\n- The chance to contribute to meaningful work that drives sustainable economic and social impact across Africa.\n- Opportunity to build a strong portfolio of marketing and social media work.`,
        form: 'marketing',
      },
      {
        title: 'Venture Sales and Market Outreach Fellow',
        description: `Job Title: Venture Sales and Market Outreach Fellow\nLocation: Addis Ababa, Ethiopia\nDuration: 2 - 3 months\nReporting To: Program Manager, Birrama Venture Studio\nContract Type: Full Time\n\nAbout Birrama Venture Studio\nBirrama is a pioneering Pan-African Venture Studio committed to revolutionizing Africa's consumption ecosystem. Unlike traditional venture capital firms, we internally conceive, launch, and scale market-leading companies that address critical challenges across high-potential sectors such as agriculture, healthcare, financial inclusion, digital commerce, electric mobility, sustainable manufacturing, and more. Our portfolio includes transformative ventures like HuluCares, Lanchi, Tena Sabi, IRIF, ID-NET, Keteme, Kovu, I Meat, KeshKesh and TechFarm Youth. We act as an institutional co-founder, providing strategic guidance, shared resources, unparalleled market access, and a relentless focus on both financial and impact metrics.\n\nAbout the Role\nBirrama is looking for an enthusiastic and proactive Venture Sales and Market Outreach Fellow to join our team in Addis Ababa. This fellowship provides an invaluable opportunity to gain hands-on experience in market research, lead generation, and client outreach strategies within the exciting realm of venture building and investment across Africa. You will support our efforts in identifying potential partners, clients, and market opportunities, directly contributing to the growth and success of our ventures.\n\nKey Responsibilities\nUnder the guidance of the Marketing Manager and in close collaboration with the broader marketing and data teams, you will:\n- Social Media Strategy Support: Assist in developing and refining social media strategies for Birrama and its individual ventures, identifying target audiences and platform-specific content approaches.\n- Content Creation & Curation: Design, draft, and curate engaging visual and written content (e.g., graphics, short videos, compelling captions) tailored for various social media platforms (Facebook, Instagram, LinkedIn, X/Twitter, TikTok, etc.).\n- Community Management: Monitor social media channels, respond to comments and messages, and actively engage with our online communities to foster positive interactions and build brand loyalty.\n- Social Listening & Trend Monitoring: Track social media conversations, identify emerging trends, and report on relevant industry news or competitor activities on social platforms.\n- Performance Tracking & Reporting: Collect and organize social media performance data (e.g., engagement rates, reach, follower growth), assist in generating regular reports, and identify insights for optimization.\n- Digital Storytelling: Help translate complex venture stories and impact narratives into digestible, shareable social media content.\n- Cross-Functional Collaboration: Work closely with the Marketing & Growth Fellow for campaign alignment, and with the Data Analytics & Insights Fellow to leverage social media data for broader insights.\n- Administrative Support: Provide general administrative assistance related to social media accounts, content calendars, and digital asset management.\n\nQualifications\n- Currently pursuing or recently completed a Bachelor's degree in Marketing, Communications, Digital Media, Journalism, or a related field.\n- Demonstrable passion for social media, with a strong understanding of various platforms and their best practices.\n- Experience with social media content creation tools (e.g., Canva, CapCut, basic photo/video editing software) \n- Excellent written communication skills in English and Amharic, with an ability to craft engaging and concise copy.\n- Strong visual eye and creativity for designing compelling social media assets.\n- Basic analytical skills, with an interest in tracking social media metrics and identifying trends.\n- Proactive, highly organized, and able to manage multiple tasks in a fast-paced environment.\n- Ability to work both independently and as part of a collaborative team.\n\nWhat We Offer\n- A unique opportunity to specialize in social media within a pioneering Pan-African Venture Studio.\n- Hands-on experience managing social media for a diverse portfolio of high-impact ventures.\n- Mentorship and professional development opportunities from experienced marketing and digital leaders.\n- A vibrant, collaborative, and inclusive work environment.\n- The chance to contribute to meaningful work that drives sustainable economic and social impact across Africa.\n- Opportunity to build a strong portfolio of marketing and social media work.`,
        form: 'sales',
      },
      {
        title: 'Frontend Developer Fellow',
        description: `Job Title: Front-End Developer Fellow\nLocation: Addis Ababa, Ethiopia\nDuration: 2 - 3 months\nReporting To: Program Manager, Birrama Venture Studio\nContract Type: Full Time\n\nAbout Birrama Venture Studio\nBirrama is a pioneering Pan-African Venture Studio committed to revolutionizing Africa's consumption ecosystem. Unlike traditional venture capital firms, we internally conceive, launch, and scale market-leading companies that address critical challenges across high-potential sectors such as agriculture, healthcare, financial inclusion, digital commerce, electric mobility, sustainable manufacturing, and more. Our portfolio includes transformative ventures like HuluCares, Lanchi, Tena Sabi, IRIF, ID-NET, Keteme, Kovu, I Meat, KeshKesh, and TechFarm Youth. We act as an institutional co-founder, providing strategic guidance, shared resources, unparalleled market access, and a relentless focus on both financial and impact metrics.\n\nAbout the Role\nWe are seeking a motivated and detail-oriented Front-End Developer Fellow to join the Birrama team. This hands-on role provides a unique opportunity to contribute directly to the design and development of digital products across our portfolio ventures. You will work alongside our in-house team to build responsive, user-friendly web interfaces and help bring innovative ideas to life through clean, maintainable code.\n\nThis fellowship is ideal for someone passionate about UI/UX, eager to grow their front-end development skills, and excited to make an impact through technology-driven solutions in emerging markets.\n\nKey Responsibilities\n- Web Interface Development: Assist in building and refining user-facing features using modern front-end frameworks (e.g., React, Next.js).\n- Collaboration with Designers & Backend Developers: Translate design mockups (e.g., from Figma) into pixel-perfect front-end components and integrate with backend APIs.\n- Responsive Design: Ensure websites are mobile-friendly, accessible, and optimized across different devices and browsers.\n- Component Reusability: Help build reusable UI components and maintain front-end style consistency across products.\n- Performance Optimization: Support the team in identifying and fixing UI bugs, optimizing load times, and improving user experience.\n- Version Control & Documentation: Use Git for version control and contribute to documentation and knowledge sharing.\n- Testing & QA: Write simple tests and participate in UI testing processes to ensure reliable front-end performance.\n- Support Internal Tools: Assist in the improvement of internal tools and dashboards that support Birrama's operations and venture growth.\n\nQualifications\n- Currently enrolled in or recently completed a Bachelor's degree in Computer Science, Software Engineering, or a related field.\n- Solid understanding of HTML, CSS, and JavaScript. Familiarity with modern front-end libraries/frameworks (especially React or Next.js) is a strong plus.\n- Experience with Git/GitHub and basic development workflows.\n- Familiarity with UI design tools (e.g., Figma) and implementation of responsive, mobile-first designs.\n- Understanding of basic RESTful API integration.\n- Eye for detail, with a strong focus on user experience and clean code practices.\n- Strong communication skills in English (Amharic is a plus).\n- Self-motivated, eager to learn, and capable of working in a fast-paced, collaborative environment.\n\nWhat We Offer\n- An immersive and practical development experience within a pioneering Pan-African Venture Studio.\n- Hands-on involvement in real-world product development and innovation.\n- Mentorship from experienced engineers and product leaders across diverse sectors.\n- A vibrant, collaborative, and inclusive work environment in the heart of Addis Ababa.\n- The chance to contribute to digital solutions that create economic and social impact at scale.\n- Opportunity to build a strong technical portfolio and gain exposure to the full startup lifecycle.\n- Stipend/compensation details will be discussed during the interview process.`,
        form: 'frontend',
      },
      {
        title: 'Backend Developer Fellow',
        description: `Job Title: Back-End Developer Fellow\nLocation: Addis Ababa, Ethiopia\nDuration: 2 - 3 months\nReporting To: Program Manager, Birrama Venture Studio\nContract Type: Full Time\n\nAbout Birrama Venture Studio\nBirrama is a pioneering Pan-African Venture Studio committed to revolutionizing Africa's consumption ecosystem. Unlike traditional venture capital firms, we internally conceive, launch, and scale market-leading companies that address critical challenges across high-potential sectors such as agriculture, healthcare, financial inclusion, digital commerce, electric mobility, sustainable manufacturing, and more. Our portfolio includes transformative ventures like HuluCares, Lanchi, Tena Sabi, IRIF, ID-NET, Keteme, Kovu, I Meat, KeshKesh, and TechFarm Youth. We act as an institutional co-founder, providing strategic guidance, shared resources, unparalleled market access, and a relentless focus on both financial and impact metrics.\n\nAbout the Role\nWe are looking for a curious and technically strong Back-End Developer Fellow to join the Birrama team. This fellowship offers a unique opportunity to work on the server-side of web and mobile applications powering ventures across our portfolio. You will be involved in designing scalable APIs, managing databases, and supporting the development of robust digital platforms.\n\nThis role is ideal for someone with a solid understanding of backend technologies, eager to learn in a fast-paced environment, and passionate about building solutions that power real impact across Africa.\n\nKey Responsibilities\n- API Development: Assist in designing, building, and maintaining RESTful or GraphQL APIs to support front-end and mobile applications.\n- Database Management: Work with relational and/or NoSQL databases (e.g., PostgreSQL, MySQL, MongoDB) for data modeling, storage, and retrieval.\n- Server-Side Logic: Develop efficient, reusable backend code that handles authentication, business logic, and data processing.\n- Third-Party Integrations: Support the integration of payment gateways, external APIs, and cloud services.\n- Security & Performance: Help ensure application security (authentication, authorization, data validation) and backend performance optimization.\n- Version Control & Collaboration: Use Git/GitHub for source control and collaborate effectively with other developers and stakeholders.\n- Testing & Debugging: Assist in writing unit tests and debugging server-side code.\n- Documentation: Contribute to technical documentation and maintain clear records of API specs, database schemas, and backend logic.\n\nQualifications\n- Currently enrolled in or recently completed a Bachelor's degree in Computer Science, Software Engineering, or a related field.\n- Strong understanding of server-side programming languages (e.g., Node.js, Python, Go, or PHP).\n- Familiarity with frameworks such as Express.js, Django, Flask, or Laravel is a plus.\n- Knowledge of databases (SQL and/or NoSQL), data modeling, and query optimization.\n- Experience working with REST or GraphQL APIs.\n- Understanding of authentication methods (OAuth2, JWT, etc.) and web security best practices.\n- Comfort with development tools like Postman, Git, and Docker (a plus).\n- Strong problem-solving skills and attention to detail.\n- Excellent communication skills in English (Amharic is a plus).\n- Self-driven and eager to learn in a collaborative, impact-driven environment.\n\nWhat We Offer\n- A hands-on, real-world learning experience within a dynamic Pan-African Venture Studio.\n- Exposure to scalable backend systems powering high-impact startups.\n- Mentorship from seasoned software engineers and product builders.\n- A collaborative and mission-driven work culture in the heart of Addis Ababa.\n- The opportunity to work on purpose-driven ventures solving real challenges across the continent.\n- Opportunity to grow your technical portfolio and contribute to scalable, resilient systems.\n- Stipend/compensation details will be discussed during the interview process.`,
        form: 'backend',
      },
      {
        title: 'DevOps Fellow',
        description: `Job Title: DevOps Fellow\nLocation: Addis Ababa, Ethiopia\nDuration: 2 - 3 months\nReporting To: Program Manager, Birrama Venture Studio\nContract Type: Full Time\n\nAbout Birrama Venture Studio\nBirrama is a pioneering Pan-African Venture Studio committed to revolutionizing Africa's consumption ecosystem. Unlike traditional venture capital firms, we internally conceive, launch, and scale market-leading companies that address critical challenges across high-potential sectors such as agriculture, healthcare, financial inclusion, digital commerce, electric mobility, sustainable manufacturing, and more. Our portfolio includes transformative ventures like HuluCares, Lanchi, Tena Sabi, IRIF, ID-NET, Keteme, Kovu, I Meat, KeshKesh, and TechFarm Youth. We act as an institutional co-founder, providing strategic guidance, shared resources, unparalleled market access, and a relentless focus on both financial and impact metrics.\n\nAbout the Role\nWe are seeking a proactive and detail-oriented DevOps Fellow to join the Birrama team. This role offers an exciting opportunity to gain hands-on experience in infrastructure management, automation, and continuous integration/continuous delivery (CI/CD) practices across a diverse set of early-stage ventures. You will work closely with both engineering and product teams to improve deployment workflows, monitor infrastructure, and ensure system reliability.\n\nThis fellowship is ideal for someone passionate about cloud computing, automation, and scalable system architecture, with a strong willingness to learn and grow in a high-impact, real-world environment.\n\nKey Responsibilities\n- CI/CD Pipeline Support: Assist in setting up and maintaining continuous integration and deployment pipelines using tools like GitHub Actions, GitLab CI, Jenkins, or similar.\n- Cloud Infrastructure: Help manage cloud environments (e.g., AWS, GCP, DigitalOcean) including server provisioning, monitoring, and scaling.\n- Containerization: Support containerized deployments using Docker and assist in managing container orchestration (e.g., Kubernetes or Docker Compose).\n- Monitoring & Alerts: Implement or maintain basic monitoring, logging, and alerting systems using tools like Prometheus, Grafana, or LogRocket.\n- Automation & Scripting: Write basic shell scripts or use tools like Ansible or Terraform to automate infrastructure setup and configuration.\n- Security & Backups: Help enforce basic security practices and assist in setting up backup and recovery processes.\n- Documentation: Maintain infrastructure documentation and deployment guides to ensure team collaboration and scalability.\n- Support Engineering Teams: Collaborate with developers to debug deployment issues, improve release cycles, and optimize runtime environments.\n\nQualifications\n- Currently enrolled in or recently completed a Bachelor's degree in Computer Science, Software Engineering, IT, or a related field.\n- Basic understanding of cloud computing platforms (AWS, GCP, Azure, or similar).\n- Familiarity with Linux systems, networking basics, and command-line operations.\n- Experience or interest in CI/CD tools (GitHub Actions, GitLab CI, etc.).\n- Knowledge of Docker; Kubernetes experience is a plus.\n- Scripting knowledge (e.g., Bash, Python) for task automation.\n- Familiarity with Git and source control practices.\n- Strong problem-solving skills, attention to detail, and eagerness to learn.\n- Good communication skills in English (Amharic is a plus).\n- Ability to work independently and collaboratively in a fast-paced environment.\n\nWhat We Offer\n- A hands-on DevOps learning experience within a pioneering Pan-African Venture Studio.\n- Exposure to real infrastructure powering high-growth startups.\n- Mentorship from experienced DevOps engineers and software architects.\n- A collaborative, impact-driven, and inclusive work culture in Addis Ababa.\n- The opportunity to contribute to meaningful products solving real problems across Africa.\n- A strong foundation to build a career in cloud computing, systems engineering, or platform development.\n- Stipend/compensation details will be discussed during the interview process.`,
        form: 'devops',
      },
      {
        title: 'Cybersecurity Fellow',
        description: `Job Title: Cybersecurity Fellow\nLocation: Addis Ababa, Ethiopia\nDuration: 2 - 3 months\nReporting To: Program Manager, Birrama Venture Studio\nContract Type: Full Time\n\nAbout Birrama Venture Studio\nBirrama is a pioneering Pan-African Venture Studio committed to revolutionizing Africa's consumption ecosystem. Unlike traditional venture capital firms, we internally conceive, launch, and scale market-leading companies that address critical challenges across high-potential sectors such as agriculture, healthcare, financial inclusion, digital commerce, electric mobility, sustainable manufacturing, and more. Our portfolio includes transformative ventures like HuluCares, Lanchi, Tena Sabi, IRIF, ID-NET, Keteme, Kovu, I Meat, KeshKesh, and TechFarm Youth. We act as an institutional co-founder, providing strategic guidance, shared resources, unparalleled market access, and a relentless focus on both financial and impact metrics.\n\nAbout the Role\nWe are seeking a diligent and analytical Cybersecurity Fellow to join the Birrama team. This hands-on role offers an exciting opportunity to gain real-world experience in securing digital systems, ensuring data privacy, and identifying potential threats across the products and platforms we build. You'll work with engineering teams to strengthen our digital infrastructure, conduct audits, and promote security best practices across ventures.\n\nThis fellowship is ideal for a security-conscious individual who is passionate about cybersecurity, eager to learn cutting-edge techniques, and wants to play a key role in protecting early-stage, high-impact startups.\n\nKey Responsibilities\n- Security Audits: Assist in performing basic security reviews of codebases, systems, and infrastructure to identify potential vulnerabilities.\n- Access Management: Help manage user access, roles, and permissions across development tools and cloud platforms.\n- Vulnerability Scanning: Use automated tools to detect known vulnerabilities in systems, software, and web applications.\n- Policy Enforcement: Support the creation and enforcement of basic security policies, such as password hygiene, data encryption, and secure development practices.\n- Incident Response: Assist in monitoring for unusual activity or incidents and documenting steps for mitigation and reporting.\n- Encryption & Data Protection: Help ensure sensitive user and business data is securely stored and transferred.\n- Secure Dev Practices: Collaborate with developers to promote secure coding practices and ensure API and authentication security.\n- Training & Awareness: Contribute to internal awareness initiatives and help build a culture of cybersecurity across the studio.\n\nQualifications\n- Currently enrolled in or recently completed a Bachelor's degree in Cybersecurity, Computer Science, Information Security, or a related field.\n- Strong interest in system security, ethical hacking, and digital risk mitigation.\n- Basic knowledge of web/app vulnerabilities (e.g., OWASP Top 10), firewalls, and network security.\n- Familiarity with security tools such as Nmap, Burp Suite, Wireshark, or similar.\n- Understanding of access controls, secure authentication, and encryption methods.\n- Experience with Git, Linux command-line tools, and basic scripting (e.g., Python, Bash) is a plus.\n- Detail-oriented, with strong problem-solving and communication skills.\n- Strong written and verbal communication in English (Amharic is a plus).\n- A proactive, self-driven learner who is eager to work on real-world systems and challenges.\n\nWhat We Offer\n- A hands-on security experience within a cutting-edge Pan-African Venture Studio.\n- Mentorship from experienced engineers and security professionals.\n- The chance to work on protecting real startups solving Africa's most pressing challenges.\n- A collaborative, innovative, and inclusive work culture in Addis Ababa.\n- Opportunity to grow your technical and analytical skills through meaningful contributions.\n- A foundation for launching a successful career in cybersecurity, DevSecOps, or digital risk management.\n- Stipend/compensation details will be discussed during the interview process.`,
        form: 'security',
      },
      {
        title: 'Mobile App Developer Fellow',
        description: `Job Title: Mobile App Developer Fellow\nLocation: Addis Ababa, Ethiopia\nDuration: 2 - 3 months\nReporting To: Program Manager, Birrama Venture Studio\nContract Type: Full Time\n\nAbout Birrama Venture Studio\nBirrama is a pioneering Pan-African Venture Studio committed to revolutionizing Africa's consumption ecosystem. Unlike traditional venture capital firms, we internally conceive, launch, and scale market-leading companies that address critical challenges across high-potential sectors such as agriculture, healthcare, financial inclusion, digital commerce, electric mobility, sustainable manufacturing, and more. Our portfolio includes transformative ventures like HuluCares, Lanchi, Tena Sabi, IRIF, ID-NET, Keteme, Kovu, I Meat, KeshKesh, and TechFarm Youth. We act as an institutional co-founder, providing strategic guidance, shared resources, unparalleled market access, and a relentless focus on both financial and impact metrics.\n\nAbout the Role\nWe are looking for a passionate and creative Mobile App Developer Fellow to join the Birrama team. This hands-on role offers a unique opportunity to work on mobile applications that power startups across multiple sectors. You will help build intuitive, high-performance Android and iOS apps that support our ventures in delivering impactful digital solutions to communities across Africa.\n\nThis fellowship is perfect for someone with a strong interest in mobile development, eager to learn in a collaborative startup environment, and excited to build applications that make a difference.\n\nKey Responsibilities\n- App Development: Assist in developing and maintaining mobile applications using frameworks like React Native or Flutter (or native Android/iOS development).\n- UI/UX Implementation: Collaborate with designers to translate Figma or similar designs into functional, responsive mobile interfaces.\n- API Integration: Work with backend developers to connect apps to RESTful or GraphQL APIs for dynamic content and functionality.\n- Testing & Debugging: Help test mobile features across devices and platforms, identify bugs, and suggest performance improvements.\n- State Management: Assist in implementing proper state management strategies (e.g., Redux, Provider, Riverpod) for scalable app logic.\n- Version Control: Use Git for code versioning and collaborate through pull requests and code reviews.\n- Publishing Support: Assist in preparing apps for deployment on Google Play Store and Apple App Store.\n- Documentation: Contribute to technical documentation and developer handoffs for smooth project continuity.\n\nQualifications\n- Currently enrolled in or recently completed a Bachelor's degree in Computer Science, Software Engineering, or a related field.\n- Proficiency in mobile development frameworks such as React Native, Flutter, or native Android (Java/Kotlin) or iOS (Swift).\n- Understanding of mobile app architecture, navigation, and state management.\n- Experience connecting mobile apps to backend APIs.\n- Familiarity with mobile debugging tools and device testing.\n- Comfortable using Git/GitHub and collaborative development practices.\n- Passion for user experience and building apps that are fast, functional, and visually polished.\n- Strong communication skills in English (Amharic is a plus).\n- Willingness to learn, experiment, and grow in a fast-paced, impact-focused environment.\n\nWhat We Offer\n- A hands-on mobile development experience inside a pioneering Pan-African Venture Studio.\n- Opportunity to build real-world apps powering impactful African ventures.\n- Mentorship from experienced mobile developers and product builders.\n- A vibrant, inclusive, and entrepreneurial work culture in the heart of Addis Ababa.\n- The chance to work on meaningful challenges that drive economic and social change.\n- A robust foundation for building your career in mobile software development.\n- Stipend/compensation details will be discussed during the interview process.`,
        form: 'mobile',
      },
    ],
    fulltime: [
      {
        title: 'Marketing, Sales & Agent Operations Manager',
        description: `Job Title: Marketing, Sales & Agent Operations Manager\nLocation: Addis Ababa, Ethiopia\nReporting To: Program Manager, Birrama Venture Lab\nContract Type: Full Time\n\nAbout Birrama Venture Studio\nBirrama is a pioneering Pan-African Venture Studio committed to revolutionizing Africa's consumption ecosystem. Unlike traditional venture capital firms, we internally conceive, launch, and scale market-leading companies that address critical challenges across high-potential sectors such as agriculture, healthcare, financial inclusion, digital commerce, electric mobility, sustainable manufacturing, and more. Our portfolio includes transformative ventures like HuluCares, lanchi, Tena Sabi, IRIF, ID-NET, Keteme, Kovu, I Meat, KeshKesh and TechFarm Youth. We act as an institutional co-founder, providing strategic guidance, shared resources, unparalleled market access, and a relentless focus on both financial and impact metrics.\n\nAbout the Role:\nWe are seeking a dynamic Marketing, Sales & Agent Operations Manager to lead the growth and adoption of our rapidly growing venture studio and the ventures within its portfolio. You will drive marketing campaigns, oversee sales strategies, and manage agent operations across regions, ensuring efficient service delivery and strong customer engagement.\n\nKey Responsibilities:\nSales Strategy & Leadership\n- Develop and execute a comprehensive sales strategy to achieve ambitious customer acquisition, product adoption, and revenue targets.\n- Establish and manage clear sales targets (KPIs) for regions, teams, and individual agents, implementing a rigorous system for performance tracking.\n- Design and implement a standardized sales playbook for agents, detailing best practices for prospecting, pitching, customer onboarding, and handling objections.\n- Analyze sales data and market trends to make data-driven decisions on territory management, resource allocation, and sales tactics.\n- Lead accurate sales forecasting and prepare detailed performance reports for senior management, providing clear visibility into the sales pipeline.\nAgent Network Management & Operations\n- Oversee the entire agent lifecycle, from recruitment, screening, and onboarding to retention and off-boarding.\n- Create and manage a highly motivational commission and incentive structure that rewards top performers and drives desired sales behaviors.\n- Develop and deliver robust, continuous training programs for agents on product knowledge, sales techniques, digital tools, and financial literacy.\n- Provide hands-on field coaching, mentorship, and support to build a loyal, motivated, and effective agent network.\n- Ensure operational excellence within the agent network, including efficient agent support, query resolution, and timely commission payouts.\nMarketing & Customer Engagement\n- Lead the strategy and execution of data-driven marketing and awareness campaigns, with a special focus on creating trust and generating leads in rural and women-centered communities.\n- Define and articulate the ID-NET value proposition to both end-customers and potential agents, ensuring all messaging is clear and resonant.\n- Collaborate with product teams to continuously optimize the customer journey and enhance the user experience.\n- Integrate financial literacy initiatives into all sales and marketing activities to empower customers and build long-term trust and loyalty.\n\nQualifications\n- Bachelor's degree in Marketing, Business, or related fields (Master's preferred)\n- 4+ years of experience in marketing, sales, or agent operations, preferably in fintech, financial services, or telecom\n- Proven success in building marketing strategies and managing agent networks\n- Strong understanding of microfinance and microinsurance\n- Digital marketing proficiency and excellent data analysis skills\n- Strong leadership, communication, and strategic thinking abilities\n- Fluency in Amharic and English (other local languages are a plus)\n- Passion for financial inclusion and empowering underserved communities\n\nWhy Join Us?\n- Lead a groundbreaking financial inclusion initiative\n- Directly impact the lives of millions\n- Competitive compensation and benefits\n- Work with cutting-edge technology and high-impact projects`,
        form: 'fulltime_manager',
      },
    ],
    parttime: [],
  };

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value } = target;
    if (name === 'cv' || name === 'coverletter') {
      setForm((f: FellowshipFormState) => ({ ...f, [name]: value }));
    } else if (name.startsWith('answer')) {
      const idx = parseInt(name.replace('answer', ''));
      setForm((f: FellowshipFormState) => ({ ...f, answers: f.answers.map((a: string, i: number) => i === idx ? value : a) }));
    } else {
      setForm((f: FellowshipFormState) => ({ ...f, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      let cvUrl = '';
      let coverLetterUrl = '';

      // 1. Upload files if present and are File objects
      if (form.cv && typeof form.cv !== 'string') {
        cvUrl = await uploadFile(form.cv, 'cv');
      } else if (typeof form.cv === 'string') {
        cvUrl = form.cv;
      }
      if (form.coverletter && typeof form.coverletter !== 'string') {
        coverLetterUrl = await uploadFile(form.coverletter, 'coverletters');
      } else if (typeof form.coverletter === 'string') {
        coverLetterUrl = form.coverletter;
      }

      // 2. Determine if this is a fellowship or full-time application
      const isFellowship = selectedFellowshipJob !== null && jobs.fellowship[selectedFellowshipJob];
      const isFullTime = selectedFulltimeJob !== null && jobs.fulltime[selectedFulltimeJob];

      if (isFellowship) {
        // Fellowship application - use jsonb answers structure
        const fellowshipRole = jobs.fellowship[selectedFellowshipJob].form;
        const fellowshipData = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: fellowshipRole,
          answers: {
            education: form.education,
            major: form.major,
            experience: form.experience,
            interest: form.interest,
            portfolio: form.portfolio,
            other: form.other,
            linkedin: form.linkedin
          },
          cv_link: cvUrl,
          coverletter_link: coverLetterUrl,
        };

        const { error } = await supabase
          .from('fellowship_applicants')
          .insert([fellowshipData]);

        if (error) {
          console.error('Fellowship submission error:', JSON.stringify(error, null, 2));
          const msg = error.message || JSON.stringify(error);
          alert('Error submitting fellowship application: ' + msg);
        } else {
          // Send confirmation email
          const emailResult = await sendConfirmationEmail(
            form.name,
            form.email,
            fellowshipRole,
            'Fellowship'
          );

          if (emailResult.success) {
            alert('Fellowship application submitted successfully!');
          } else {
            alert('Fellowship application submitted successfully!');
            console.error('Email error:', emailResult.error);
          }

          setSubmitted(true);
          setForm({
            name: '',
            email: '',
            phone: '',
            cv: null,
            answers: Array(13).fill(''),
            linkedin: '',
            education: '',
            major: '',
            experience: '',
            interest: '',
            portfolio: '',
            other: '',
            sales_experience: '',
            coverletter: null,
            education_fulltime: '',
            answers_fulltime: Array(13).fill(''),
          });
        }
      } else if (isFullTime) {
        // Full-time application - use individual question columns
        const fulltimeData = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: 'fulltime',
          q1: form.answers_fulltime[0],
          q2: form.answers_fulltime[1],
          q3: form.answers_fulltime[2],
          q4: form.answers_fulltime[3],
          q5: form.answers_fulltime[4],
          q6: form.answers_fulltime[5],
          q7: form.answers_fulltime[6],
          q8: form.answers_fulltime[7],
          q9: form.answers_fulltime[8],
          q10: form.answers_fulltime[9],
          q11: form.answers_fulltime[10],
          q12: form.answers_fulltime[11],
          q13: form.answers_fulltime[12],
          cv_link: cvUrl,
          coverletter_link: coverLetterUrl,
        };

        const { error } = await supabase
          .from('fulltime_applicants')
          .insert([fulltimeData]);

        if (error) {
          console.error('Full-time submission error:', JSON.stringify(error, null, 2));
          const msg = error.message || JSON.stringify(error);
          alert('Error submitting full-time application: ' + msg);
        } else {
          // Send confirmation email
          const emailResult = await sendConfirmationEmail(
            form.name,
            form.email,
            'fulltime',
            'Full-time'
          );

          if (emailResult.success) {
            alert('Full-time application submitted successfully!');
          } else {
            alert('Full-time application submitted successfully!');
            console.error('Email error:', emailResult.error);
          }

          setSubmitted(true);
          setForm({
            name: '',
            email: '',
            phone: '',
            cv: null,
            answers: Array(13).fill(''),
            linkedin: '',
            education: '',
            major: '',
            experience: '',
            interest: '',
            portfolio: '',
            other: '',
            sales_experience: '',
            coverletter: null,
            education_fulltime: '',
            answers_fulltime: Array(13).fill(''),
          });
        }
      }
    } catch (error) {
      console.error('Application submission error:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRecommendSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRecommendLoading(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      
      // Determine which role this recommendation is for
      let recommendationRole = 'data'; // default
      if (selectedFellowshipJob !== null) {
        recommendationRole = jobs.fellowship[selectedFellowshipJob].form;
      } else if (selectedFulltimeJob !== null) {
        recommendationRole = 'fulltime';
      }
      
      const recommendationData = {
        recommender_name: formData.get('recName') as string,
        recommender_email: formData.get('recEmail') as string,
        recommender_phone: formData.get('recPhone') as string,
        recommended_name: formData.get('recName') as string, // Using same name for now
        recommended_email: formData.get('recEmail') as string, // Using same email for now
        recommended_phone: formData.get('recPhone') as string, // Using same phone for now
        recommended_linkedin: formData.get('recLinkedIn') as string || null,
        role: recommendationRole,
      };

      const { error } = await supabase
        .from('recommendations')
        .insert([recommendationData]);

      if (error) {
        console.error('Recommendation submission error:', JSON.stringify(error, null, 2));
        const msg = error.message || JSON.stringify(error);
        alert('Error submitting recommendation: ' + msg);
      } else {
        alert('Recommendation submitted successfully!');
        setStep('desc');
      }
    } finally {
      setRecommendLoading(false);
    }
  }

  return (
    <div className="border-8 border-[#171717] rounded-3xl bg-[#232323] overflow-hidden shadow-2xl mb-4 mt-2 w-full h-screen flex flex-col">
      {/* Modal for expanded description */}
      {expandedDescription && (
        <div ref={modalRef} onClick={handleModalClick} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#232323] rounded-2xl shadow-2xl w-[95vw] max-w-3xl max-h-[90vh] p-6 overflow-y-auto relative border-2 border-white">
            <button onClick={() => setExpandedDescription(null)} className="absolute top-2 right-2 text-white text-2xl font-bold">&times;</button>
            <pre className="text-white whitespace-pre-wrap text-base font-sans w-full" style={{fontFamily:'inherit'}}>{expandedDescription}</pre>
          </div>
        </div>
      )}
      <div className="w-full h-full p-8 overflow-y-auto flex flex-col items-center">
        {step === 'role' && (
          <div className="flex flex-1 flex-col justify-center items-center w-full h-full">
            <h2 className="text-white text-3xl md:text-5xl font-black mb-8 text-center">Birrama Job Application</h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center">
              <button
                className="relative bg-[#4FC3F7] hover:bg-[#039BE5] text-white font-bold py-4 px-8 rounded-2xl text-2xl transition-all duration-200 shadow-lg flex items-center gap-2 border-4 border-[#4FC3F7]"
                style={{ minWidth: 170 }}
                onClick={() => { setStep('fulltimejob'); }}
              >
                Full Time
                <span className="absolute -top-2 -right-2 bg-transparent text-white text-base" style={{ pointerEvents: 'none' }}>★</span>
              </button>
              <button className="bg-[#4FC3F7] hover:bg-[#039BE5] text-white font-bold py-4 px-8 rounded-2xl text-2xl transition-all duration-200 shadow-lg" onClick={() => setStep('job')}>Fellowship</button>
            </div>
          </div>
        )}   
        {step === 'job' && (
          <div className="flex flex-1 flex-col justify-center items-center w-full h-full">
            <h2 className="text-white text-2xl md:text-4xl font-black mb-8 text-center">Fellowship Roles</h2>
            {jobs.fellowship.map((job, idx) => (
              <button key={idx} className="bg-white text-[#4FC3F7] font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-200 shadow-lg border-2 border-[#B6E3E3] mb-4 w-full max-w-xl" onClick={() => { setSelectedFellowshipJob(idx); setSelectedFulltimeJob(null); setStep('desc'); }}>
                {job.title}
              </button>
            ))}
            <button className="mt-8 underline text-white text-lg" onClick={() => setStep('role')}>Back</button>
          </div>
        )}
        {step === 'fulltimejob' && (
          <div className="flex flex-1 flex-col justify-center items-center w-full h-full">
            <h2 className="text-white text-2xl md:text-4xl font-black mb-8 text-center">Full Time Roles</h2>
            {jobs.fulltime.map((job, idx) => (
              <button key={idx} className="bg-white text-[#4FC3F7] font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-200 shadow-lg border-2 border-[#B6E3E3] mb-4 w-full max-w-xl" onClick={() => { setSelectedFulltimeJob(idx); setSelectedFellowshipJob(null); setStep('desc'); }}>
                {job.title}
              </button>
            ))}
            <button className="mt-8 underline text-white text-lg" onClick={() => setStep('role')}>Back</button>
          </div>
        )}
        {step === 'desc' && selectedFellowshipJob !== null && selectedFulltimeJob === null && (
          <div className="flex flex-1 flex-col justify-center items-center w-full h-full">
            <h2 className="text-white text-2xl md:text-4xl font-black mb-8 text-center">
              {jobs.fellowship[selectedFellowshipJob]?.title}
            </h2>
            <pre
              className="bg-[#232323] text-white text-left whitespace-pre-wrap p-4 rounded-xl w-full max-w-2xl min-w-0 mb-8 border-2 border-white overflow-x-auto text-xs sm:text-sm md:text-base cursor-pointer hover:ring-2 hover:ring-[#4FC3F7] transition-all"
              style={{fontFamily:'inherit'}}
              title="Click to expand"
              onClick={() => setExpandedDescription(jobs.fellowship[selectedFellowshipJob]?.description || '')}
            >
              {jobs.fellowship[selectedFellowshipJob]?.description}
            </pre>
            <div className="flex flex-col md:flex-row gap-8 justify-center">
              <button className="bg-[#4FC3F7] hover:bg-[#039BE5] text-white font-bold py-4 px-8 rounded-2xl text-2xl transition-all duration-200 shadow-lg" onClick={() => setStep('self')}>I qualify to apply</button>
              <button className="bg-white hover:bg-gray-200 text-[#4FC3F7] font-extrabold py-4 px-8 rounded-2xl text-2xl transition-all duration-200 shadow-lg border-2 border-[#B6E3E3]" onClick={() => setStep('recommend')}>Recommend another person</button>
            </div>
            <button className="mt-8 underline text-white text-lg" onClick={() => setStep('job')}>Back</button>
          </div>
        )}
        {step === 'desc' && selectedFulltimeJob !== null && selectedFellowshipJob === null && (
          <div className="flex flex-1 flex-col justify-center items-center w-full h-full">
            <h2 className="text-white text-2xl md:text-4xl font-black mb-8 text-center">
              {jobs.fulltime[selectedFulltimeJob]?.title}
            </h2>
            <pre
              className="bg-[#232323] text-white text-left whitespace-pre-wrap p-4 rounded-xl w-full max-w-2xl min-w-0 mb-8 border-2 border-white overflow-x-auto text-xs sm:text-sm md:text-base cursor-pointer hover:ring-2 hover:ring-[#4FC3F7] transition-all"
              style={{fontFamily:'inherit'}}
              title="Click to expand"
              onClick={() => setExpandedDescription(jobs.fulltime[selectedFulltimeJob]?.description || '')}
            >
              {jobs.fulltime[selectedFulltimeJob]?.description}
            </pre>
            <div className="flex flex-col md:flex-row gap-8 justify-center">
              <button className="bg-[#4FC3F7] hover:bg-[#039BE5] text-white font-bold py-4 px-8 rounded-2xl text-2xl transition-all duration-200 shadow-lg" onClick={() => setStep('self')}>I qualify to apply</button>
              <button className="bg-white hover:bg-gray-200 text-[#4FC3F7] font-extrabold py-4 px-8 rounded-2xl text-2xl transition-all duration-200 shadow-lg border-2 border-[#B6E3E3]" onClick={() => setStep('recommend')}>Recommend another person</button>
            </div>
            <button className="mt-8 underline text-white text-lg" onClick={() => setStep('fulltimejob')}>Back</button>
          </div>
        )}
        {step === 'self' && !submitted && (
          <>
            {selectedFellowshipJob !== null ? (
              <FellowshipApplicationForm
                form={form}
                handleInput={handleInput}
                handleSubmit={handleSubmit}
                setStep={setStep}
                role={jobs.fellowship[selectedFellowshipJob]?.form as 'data' | 'marketing' | 'sales' | 'frontend' | 'backend' | 'devops' | 'security' | 'mobile'}
                loading={loading}
              />
            ) : selectedFulltimeJob !== null ? (
              <FullTimeApplicationForm
                form={form}
                setForm={setForm}
                handleInput={handleInput}
                handleSubmit={handleSubmit}
                setStep={setStep}
                questions={[
                  'Share an example of a successful marketing campaign you led that focused on building trust within underserved or women-centered communities. What challenges did you face, and how did you overcome them?',
                  'In your experience, what has been the most effective way to align marketing strategies with sales goals? Provide a real-life scenario where this alignment produced measurable results.',
                  'How do you ensure that digital marketing initiatives translate into tangible business impact? Give an example of a digital campaign you optimized based on performance data.',
                  'Describe a complex challenge you faced in managing agent operations across multiple regions. How did you standardize processes while adapting to local market conditions?',
                  'Tell me about a time when you had to lead a demotivated or underperforming team. What actions did you take to improve performance, and how did you measure success?',
                  'Describe your approach to mentoring field agents. How do you balance hands-on coaching with empowering them to work independently?',
                  'How do you evaluate and track the performance of individual agents and teams? What KPIs do you consider most critical, and why?',
                  'Tell me about a time when you had to scale up an agent network rapidly. What steps did you take to maintain quality while expanding quickly?',
                  'You are assigned a new venture within the studio that is struggling with low adoption in rural areas. Outline how you would develop a go-to-market strategy, including both marketing and agent engagement tactics.',
                  'You\'ve launched a new product and created a compelling pitch deck, but your agents aren\'t adopting it. What steps would you take to understand the resistance and encourage adoption?',
                  'A major competitor enters your market with a similar offering. How would you adjust your marketing and sales strategies to maintain or grow your market share?',
                  'Our ventures operate in diverse sectors such as agriculture, healthcare, and electric mobility. How comfortable are you working across different industries, and how do you adapt your marketing and sales approach accordingly?',
                  'We value innovation and impact-driven work. Can you share a personal or professional achievement that reflects your ability to think creatively and deliver meaningful results?'
                ]}
                loading={loading}
              />
            ) : (
              <div className="text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Error: No job selected</h3>
                <button 
                  className="bg-[#4FC3F7] hover:bg-[#039BE5] text-white font-bold py-3 px-8 rounded-xl text-xl"
                  onClick={() => setStep('role')}
                >
                  Back to Job Selection
                </button>
              </div>
            )}
          </>
        )}
        {step === 'self' && submitted && (
          <div className="text-white text-xl mt-8 w-full max-w-xl text-center">
            <h3 className="text-3xl font-bold mb-4">Thank you for applying!</h3>
            <p>Your application has been submitted.</p>
            <button
              className="mt-8 underline"
              onClick={() => {
                setSubmitted(false);
                setForm({
                  name: '',
                  email: '',
                  phone: '',
                  cv: null,
                  answers: Array(13).fill(''),
                  linkedin: '',
                  education: '',
                  major: '',
                  experience: '',
                  interest: '',
                  portfolio: '',
                  other: '',
                  sales_experience: '',
                  coverletter: null,
                  education_fulltime: '',
                  answers_fulltime: Array(13).fill(''),
                });
                setSelectedFellowshipJob(null);
                setSelectedFulltimeJob(null);
                setStep('role');
              }}
            >
              Back
            </button>
          </div>
        )}
        {step === 'recommend' && (
          <form className="bg-[#232323] p-6 rounded-2xl w-full max-w-xl min-w-[320px] text-white flex flex-col gap-6 mx-auto" onSubmit={handleRecommendSubmit}>
            <h3 className="text-3xl font-bold mb-2">Recommend Someone</h3>
            <label className="flex flex-col gap-2">
              Name*
              <input name="recName" className="p-2 rounded text-black border-2 border-white bg-white" required />
            </label>
            <label className="flex flex-col gap-2">
              Email*
              <input name="recEmail" type="email" className="p-2 rounded text-black border-2 border-white bg-white" required />
            </label>
            <label className="flex flex-col gap-2">
              Phone Number*
              <input name="recPhone" className="p-2 rounded text-black border-2 border-white bg-white" required />
            </label>
            <label className="flex flex-col gap-2">
              LinkedIn Account (optional)
              <input name="recLinkedIn" className="p-2 rounded text-black border-2 border-white bg-white" />
            </label>
            <button type="submit" className="bg-[#4FC3F7] hover:bg-[#039BE5] text-white font-bold py-3 px-8 rounded-xl text-xl mt-6" disabled={recommendLoading}>
              {recommendLoading ? 'Submitting...' : 'Submit Recommendation'}
            </button>
            <button type="button" className="mt-2 underline" onClick={() => setStep('desc')}>Back</button>
          </form>
        )}
      </div>
    </div>
  );
}
