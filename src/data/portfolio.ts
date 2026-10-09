export const portfolio = {
  name: 'Karthick A',
  heroName: 'KARTHICK A',
  roles: ['Full Stack Developer', 'DevOps', 'Generative AI', 'LLMs', 'RAG', 'AI Agents'],
  navigation: ['About', 'Skills', 'Experience', 'Projects', 'Contact'],
  intro: "Hi there! I engineer digital experiences at the intersection of software, intelligence, and design. My work revolves around architecting scalable full-stack systems, AI-driven applications, and intelligent workflows, from high-performance APIs and distributed services to LLM-powered solutions and immersive interfaces. I work across Python, FastAPI, React.js, TypeScript, PostgreSQL, LLMs, Generative AI, RAG, Docker, Kubernetes, CI/CD, and AWS, with a strong focus on system architecture, automation, performance, and maintainability. I'm driven by one principle: complex problems deserve elegant engineering.",
  aboutHeading: 'Passionate developer crafting digital experiences with precision and innovation',
  journeyHeading: 'My Journey',
  journey: [
    'Full Stack Developer at Ospira Technologies Private Limited (March 2026 - Present): intelligent systems, backend orchestration, LLM and RAG pipelines, modern web experiences.',
    'Software Developer at Thirdvizion Labs (August 2025 - January 2026): AI-enabled applications, end-to-end development across backend orchestration, data persistence, API integrations.',
    'Python Developer intern at InLustro (January 2024 - March 2024).',
    'MCA Computer Science, VELS University (October 2023 - May 2025).',
    'BCA Data Science, BSA Crescent Institute of Science and Technology (September 2020 - May 2023).',
  ],
  stats: [{value: 17, suffix: '+', label: 'Months Experience'}, {value: null, suffix: 'AI', label: 'Driven Systems'}, {value: 10, suffix: '+', label: 'Core Tools'}, {value: 5, suffix: '', label: 'Certifications'}],
  skillsHeading: 'Technical Skills',
  skills: [{name:'Artificial Intelligence',value:95},{name:'Python',value:94},{name:'React.js',value:93},{name:'FastAPI',value:92},{name:'Docker',value:90},{name:'PostgreSQL',value:90},{name:'TypeScript',value:88},{name:'CI/CD',value:87},{name:'Kubernetes',value:82},{name:'AWS',value:80}],
  experienceHeading: 'Where Innovation Meets Execution',
  experience: [
    {company:'Ospira Technologies Private Limited',role:'Full-stack Developer',date:'March 2026 - Present',duration:'8 months',startMonth:'2026-03',endMonth:null,description:'Backend orchestration, intelligent systems, LLM & RAG pipelines, type-safe frontend architecture, reactive state orchestration, data-centric application design, containerized infrastructure, continuous delivery, and immersive web experiences.',achievements:[
      'Architecting and delivering scalable AI-enabled applications across full-cycle development, complex feature engineering, backend orchestration, data persistence, and API integration.',
      'Building LLM-powered workflows, RAG pipelines, and intelligent automation systems for business-critical use cases.',
      'Developing containerized, production-ready stack components with React.js, TypeScript, Python, FastAPI, PostgreSQL, Docker, Kubernetes, CI/CD, and AWS.'
    ],tech:['Python','FastAPI','React.js','TypeScript','PostgreSQL','Docker','Kubernetes','CI/CD','AWS','LLMs','RAG','AI Agents']},
    {company:'Thirdvizion Labs',role:'Software Developer',date:'August 2025 - January 2026',duration:'6 months',startMonth:'2025-08',endMonth:'2026-01',description:'Architected and delivered scalable, AI-enabled applications, overseeing full-cycle development, feature engineering, backend orchestration, data persistence, and API integrations.',achievements:[
      'Built AI-enabled features and modules while coordinating the end-to-end SDLC from design to deployment.',
      'Worked on backend orchestration and data layer architecture for scalable product workflows.',
      'Collaborated on API-driven application design, integration surfaces, and performance-oriented implementation.'
    ],tech:['Python','FastAPI','PostgreSQL','AI','APIs','System Design','Docker']},
    {company:'InLustro',role:'Python Developer',date:'January 2024 - March 2024',duration:'3 months',startMonth:'2024-01',endMonth:'2024-03',description:'Python-focused environment, contributing to application logic, backend routines, and data-processing workflows.',achievements:[
      'Developed and refined Python backend logic for application features.',
      'Maintained clean, efficient server-side processing patterns and integration tasks.',
      'Hands-on exposure to practical software engineering workflows.'
    ],tech:['Python','Backend','Data Processing','Application Logic']}
  ],
  certificationsHeading: 'Continuously expanding expertise through certified learning',
  certifications:[
    {title:'Python training',type:'Training Program',year:'2024',level:'Professional',tags:['Python','Programming','Automation']},
    {title:'The complete front end web development course',type:'Online Course',year:'2023',level:'Professional',tags:['HTML','CSS','JavaScript','React']},
    {title:'React developer',type:'Frontend Certification',year:'2024',level:'Advanced',tags:['React','Hooks','State Management']},
    {title:'Redux toolkit',type:'State Management',year:'2023',level:'Advanced',tags:['Redux','Toolkit','State Architecture']},
    {title:'RDBMS PostgreSQL certificate',type:'Database Certification',year:'2024',level:'Professional',tags:['PostgreSQL','SQL','Database Design']}
  ],
  projectsHeading: 'Enterprise-scale systems blending AI, automation, psychology and SaaS',
  filters: [],
  featured:{
    title:'OSPIRA: Multi-Stakeholder Psychological Assessment & Child Development Platform',
    tech:['FastAPI','React 19','TypeScript','PostgreSQL','SQLAlchemy','ReportLab','OpenAI','Google Sheets/Drive/Calendar APIs','Razorpay','Nimbbl','Docker'],
    problem:'Traditional assessments capture a single perspective and rely on manual spreadsheet scoring.',
    solution:'An automated ecosystem capturing Parent 1, Parent 2 and Child assessments, scoring through Google Sheets as a headless calculation engine, and generating clinical PDF reports automatically.',
    stats:[{value:1,suffix:'',label:'FastAPI backend'},{value:6,suffix:'',label:'React frontends'},{value:7,suffix:'',label:'PDF reports per assessment'},{value:null,suffix:'↗',label:'Automated scoring pipeline'}],
    architecture:['Client apps','FastAPI','Cron workers'],
    services:['PostgreSQL','Google APIs','Payments','OpenAI']
  },
  engineeringProjects:[
    {title:'LLM-Powered Insight Assistant',discipline:'LLM APPLICATION ENGINEERING',description:'Integrated an OpenAI-powered assistant into a real assessment product, rather than leaving it as an isolated chat demo. Responses stream to the client over Server-Sent Events so users can see answers arrive progressively. Connected the assistant to the product workflow and shaped prompts around the clinical context. Added prompt guardrails to keep responses aligned with the intended use of the platform. Focused on a dependable end-to-end experience across the API, model response, and React interface.',tech:['OpenAI','LLMs','SSE','FastAPI','React','Prompt Guardrails']},
    {title:'Retrieval-Augmented Generation Pipelines',discipline:'RAG SYSTEM DESIGN',description:'Worked on RAG pipelines that bring relevant knowledge into a model request instead of relying on a model’s general memory alone. Structured the flow around preparing source content, retrieving useful context, and composing that context with the user’s question. Tuned the boundary between retrieval and generation so answers stay useful and tied to the material provided. Considered failure cases such as weak matches and incomplete context in the response path. Built the pipeline as a service that can connect cleanly to a larger application.',tech:['Python','RAG','Embeddings','Retrieval','LLMs','FastAPI']},
    {title:'Tool-Using AI Agent Workflows',discipline:'AI AGENT ORCHESTRATION',description:'Designed agent workflows to move beyond single-turn chat and complete multi-step tasks through controlled tool use. Broke a request into clear stages, routed work to the appropriate capability, and passed structured results between steps. Connected agent actions to application services and APIs so the workflow can operate on real product data. Added validation and explicit handling around tool results to make failures easier to detect and recover from. Kept the orchestration observable and bounded, with the model assisting the workflow rather than owning every decision.',tech:['AI Agents','Python','Tool Calling','API Integration','Workflow Orchestration']},
    {title:'Generative AI Product Features',discipline:'GENERATIVE AI ENGINEERING',description:'Built generative AI capabilities as part of user-facing product journeys, with attention to the full experience around the model call. Prepared task-specific instructions and relevant application context before generating a response. Connected model output to streaming interfaces and product APIs instead of treating generated text as a standalone result. Applied guardrails to keep outputs appropriate to their feature context and made the interaction understandable to users. Designed the integration so model behavior can evolve without coupling the entire product to one prompt or provider.',tech:['Generative AI','OpenAI','Prompt Design','Streaming','TypeScript','Python']},
    {title:'Containerized Delivery & Cloud Operations',discipline:'DEVOPS & PLATFORM ENGINEERING',description:'Worked across containerized application delivery using Docker, Kubernetes, CI/CD practices, and AWS in production-oriented stacks. Packaged services and supporting components to make environments more repeatable from development through deployment. Connected code changes to automated delivery workflows and kept deployment configuration separate from application logic. Considered service health, operational failure paths, and the coordination of backend services during releases. Brought infrastructure and application engineering together so features could move from implementation toward reliable operation.',tech:['Docker','Kubernetes','CI/CD','AWS','FastAPI','PostgreSQL']},
    {title:'Multi-Stakeholder Assessment Platform',discipline:'COMPLEX SAAS SYSTEM DESIGN',description:'Helped shape an assessment platform that brings parent and child perspectives into one coordinated workflow. Built around multiple React applications backed by FastAPI services, with PostgreSQL persistence and automated assessment processing. Integrated Google services for scoring and scheduling, payment gateways for transactions, and generated PDF reports for assessment outcomes. Designed supporting operational flows for corporate credits, partner experiences, and administration rather than a single-user happy path. The result is a connected SaaS ecosystem with several client apps sharing backend capabilities and business rules.',tech:['FastAPI','React 19','PostgreSQL','Google APIs','Razorpay','Nimbbl','ReportLab']}
  ],
  features:[
    {title:'Headless Scoring Engine',text:'Google Sheet cloned per candidate, answers streamed to mapped cells, pivot formulas calculate scores.',category:'Backend'},
    {title:'Dual-Parent + Child Alignment Matrix',text:'compares how each parent and the child see the same competencies.',category:'Backend'},
    {title:'Vector PDF Report Engine (ReportLab)',text:'7 diagnostic PDFs delivered as an encrypted ZIP.',category:'Backend'},
    {title:'PII Security',text:'AES-256 field encryption with HMAC-SHA256 blind indexing.',category:'Backend'},
    {title:'Insight AI',text:'OpenAI streaming assistant (SSE) with clinical prompt guardrails.',category:'AI'},
    {title:'Corporate Credit Pools',text:'multi-tenant quotas, monthly resets, employee wellness benefits.',category:'Backend'},
    {title:'Google Meet Automation',text:'Calendar domain-wide delegation for counselor booking.',category:'Backend'},
    {title:'Dual Payment Gateways',text:'Razorpay + Nimbbl, signature verification, coupons, GST invoices.',category:'Backend'},
    {title:'Resilient Cron Pipeline',text:'state machine (Pending, Running, Completed, Error) with admin retry.',category:'DevOps'},
    {title:'White-labeled Partner Assets',text:'partner-branded sheets and PDFs.',category:'Frontend'}
  ],
  applications:[
    {title:'User App',text:'B2C assessments, report vault, consultation booking, Insight AI chat',tech:['React 19','TypeScript','Zustand','Framer Motion'],categories:['Frontend','AI']},
    {title:'Corporate Platform',text:'HR console, employee wellness portal, credit store',tech:['React 19','TypeScript','Tailwind v4','TanStack Router'],categories:['Frontend']},
    {title:'Partner Portal',text:'referral tracking, lifecycle tracker, commission analytics',tech:['React 19','ApexCharts'],categories:['Frontend']},
    {title:'Admin Command Center',text:'template binding, pipeline monitor, question CMS, coupons',tech:['React 19','ApexCharts'],categories:['Frontend','Backend']},
    {title:'Webinar Portal',text:'event landing, registration, Razorpay ticketing',tech:['React 19','Vite'],categories:['Frontend']},
    {title:'Brand Website + Moodle LMS',text:'GSAP animated site, branded Moodle 4.4 on Docker',tech:['GSAP','Tailwind v4','PHP 8.2'],categories:['Frontend','DevOps']}
  ],
  contact:{heading:"Let's build something together",email:'karthickanbu81@gmail.com' as string|null,location:'Chennai, Tamil Nadu',github:'https://github.com/karthickanbu1' as string|null,linkedin:'https://www.linkedin.com/in/karthick-a-in' as string|null},
  copyright:'© 2026 Karthick A',
  labels:{viewProjects:'View Projects',aboutMe:'About Me',architecture:'View Architecture',features:'Key Features',applications:'Applications',achievements:'Key Achievements',problem:'Problem',solution:'Solution',comingSoon:'Coming Soon',photo:'Photo placeholder',email:'Email',name:'Name',emailField:'Email',message:'Message',send:'Send Message',contactUnavailable:'Contact email is not available yet. Your message has not been sent.',github:'GitHub',linkedin:'LinkedIn'},
  seo:{title:'Karthick A — Full Stack Developer, DevOps & AI',description:'Karthick A — Full Stack Developer | DevOps | Generative AI | LLMs | RAG | AI Agents. Explore experience, certifications, and enterprise-scale projects.'}
};
