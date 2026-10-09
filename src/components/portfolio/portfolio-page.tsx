import { useEffect, useState, useRef, type FormEvent } from 'react';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import Lenis from 'lenis';
import { ArrowUpRight, ArrowDown, ArrowUp, Sun, Moon, Menu, X, Code2, Braces, GraduationCap, BriefcaseBusiness, ChevronDown, BrainCircuit, Layers3, ShieldCheck, Database, FileText, Users, Calendar, CreditCard, Workflow, Building2, Github, Linkedin, Mail, MapPin, Send, ArrowRight, UserRound, Atom, Terminal, Globe, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { portfolio as p } from '@/data/portfolio';
import ElectricLogo from './ElectricLogo';
import TechText from '@/components/TechText';
import DitherVeil from '@/components/DitherVeil';
import { Count, Reveal, Tags, SectionHeading, skillIcons } from './elements';
import RubberSegment from './RubberSegment';

const featureIcons=[Database,Users,FileText,ShieldCheck,BrainCircuit,Building2,Calendar,CreditCard,Workflow,Layers3];
const appIcons=[UserRound,Building2,Users,Terminal,Calendar,Globe];
const currentMonthKey=(date:Date)=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
const monthIndex=(month:string)=>{
  const [yearPart,monthPart]=month.split('-');
  const year=Number(yearPart);const monthNumber=Number(monthPart);
  if(!Number.isInteger(year)||!Number.isInteger(monthNumber)||monthNumber<1||monthNumber>12)return 0;
  return year*12+monthNumber;
};
const monthsInclusive=(startMonth:string,endMonth:string)=>Math.max(0,monthIndex(endMonth)-monthIndex(startMonth)+1);
export function PortfolioPage(){
  const timelineRef=useRef<HTMLDivElement>(null);const {scrollYProgress:pageProgress}=useScroll();const {scrollYProgress:timelineProgress}=useScroll({target:timelineRef,offset:['start 78%','end 35%']});
  const [light,setLight]=useState(true);const [menu,setMenu]=useState(false);const [active,setActive]=useState('');const [scrolled,setScrolled]=useState(false);const [role,setRole]=useState(0);const [typed,setTyped]=useState('');const [filter,setFilter]=useState('All');const [expanded,setExpanded]=useState<number[]>([]);const [feedback,setFeedback]=useState('');const [asOfDate,setAsOfDate]=useState<Date|null>(null);const reduced=useReducedMotion();const cursor=useRef<HTMLDivElement>(null);
  useEffect(()=>{let timeout:number;const updateAtMonthChange=()=>{const now=new Date();setAsOfDate(now);const nextMonth=new Date(now.getFullYear(),now.getMonth()+1,1);timeout=window.setTimeout(updateAtMonthChange,nextMonth.getTime()-now.getTime());};updateAtMonthChange();return()=>window.clearTimeout(timeout);},[]);
  useEffect(()=>{const updateScrollState=()=>setScrolled(window.scrollY>20);updateScrollState();window.addEventListener('scroll',updateScrollState,{passive:true});return()=>window.removeEventListener('scroll',updateScrollState);},[]);
  useEffect(()=>{const lenis=new Lenis({autoRaf:true,duration:1.2,easing:(t)=>Math.min(1,1.001-Math.pow(2,-10*t)),lerp:0.085,smoothWheel:true,wheelMultiplier:0.9,touchMultiplier:1.1,anchors:{offset:window.matchMedia('(max-width: 767px)').matches?-70:-88},respectReducedMotion:true});return()=>lenis.destroy();},[]);
  useEffect(()=>{if(reduced||!window.matchMedia('(pointer: fine)').matches)return;const move=(event:PointerEvent)=>{if(cursor.current){cursor.current.style.transform=`translate(${event.clientX}px,${event.clientY}px)`;cursor.current.style.opacity='.35';}};window.addEventListener('pointermove',move);return()=>window.removeEventListener('pointermove',move);},[reduced]);
  useEffect(()=>{setLight(localStorage.getItem('portfolio-theme-v2')!=='dark');},[]);
  useEffect(()=>{document.documentElement.classList.toggle('light',light);document.documentElement.classList.toggle('dark',!light);},[light]);
  useEffect(()=>{if(reduced){setTyped(p.roles[0] ?? '');return;}const word=p.roles[role] ?? '';let length=0;const typing=setInterval(()=>{length++;setTyped(word.slice(0,length));if(length>=word.length)clearInterval(typing);},65);const next=setTimeout(()=>{setRole(v=>(v+1)%p.roles.length);},2800);return()=>{clearInterval(typing);clearTimeout(next);};},[role,reduced]);
  useEffect(()=>{const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)setActive(e.target.id);});},{rootMargin:'-15% 0px -65% 0px'});p.navigation.forEach(n=>{const element=document.getElementById(n.toLowerCase());if(element)observer.observe(element);});return()=>observer.disconnect();},[]);
  function toggleTheme(){setLight(v=>{localStorage.setItem('portfolio-theme-v2',v?'dark':'light');return !v;});}
  function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(!p.contact.email){setFeedback(p.labels.contactUnavailable);return;}const data=new FormData(e.currentTarget);window.location.href=`mailto:${p.contact.email}?subject=${encodeURIComponent('Portfolio enquiry from '+String(data.get('name')))}&body=${encodeURIComponent(String(data.get('message'))+'\n\n'+String(data.get('email')))}`;}
  return <div className="portfolio"><motion.div className="scroll-progress" style={{scaleX:pageProgress}} aria-hidden="true"/><div ref={cursor} className="cursor-trace" aria-hidden="true"/>
    <header className={`site-header${scrolled?' site-header-scrolled':''}`}><div className="container header-inner"><a href="#" className="brand" aria-label="Karthick A home"><span className="brand-mark"><Braces size={21}/></span>{p.name}<span className="text-primary">.</span></a><nav aria-label="Main navigation" className="desktop-nav"><RubberSegment items={p.navigation.map(n=>({value:n.toLowerCase(),label:n}))} value={active||'about'} onChange={section=>{setActive(section);document.getElementById(section)?.scrollIntoView({behavior:'smooth'});}} trackColor="var(--muted)" thumbColor="var(--primary)" textColor="var(--muted-foreground)" activeTextColor="var(--primary-foreground)" size="sm" radius={10} inset={3} equalSlots stretch={100} squash={3} speed={1} glide={75} draggable disabled={false} className="header-segment-nav" aria-label="Portfolio sections"/></nav><div className="flex gap-2"><Button size="icon" variant="ghost" onClick={toggleTheme} aria-label={light?'Switch to dark theme':'Switch to light theme'} title={light?'Dark theme':'Light theme'}>{light?<Moon size={18}/>:<Sun size={18}/>}</Button><Button className="mobile-menu-button" size="icon" variant="ghost" aria-label="Toggle navigation" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</Button></div></div>{menu&&<nav className="mobile-nav" aria-label="Mobile navigation">{p.navigation.map(n=><a key={n} href={`#${n.toLowerCase()}`} onClick={()=>setMenu(false)}>{n}</a>)}</nav>}</header>
    <main>
      <section className="hero">
        <div className="hero-grid"/>
        <div className="container hero-layout">
          <div className="hero-content"><div className="eyebrow hero-eyebrow"><span className="hero-line"/> FULL STACK · DEVOPS · ARTIFICIAL INTELLIGENCE</div><div className="hero-name-heading" role="heading" aria-level={1}><TechText text="KARTHICK A" align="left" fontWeight={700} fontSize={180} fontFamily="Space Grotesk" letterSpacing={-0.05} color={light?'#142522':'#f4fffc'} accentColor={light?'#008b7a':'#78e7d5'} reveal="letter" dashLength={4} dashGap={2} specks={15}/></div><div className="typing-line"><span className="text-secondary">&gt;</span><span aria-hidden="true">{typed}<span className="typing-cursor">_</span></span><span className="sr-only">{p.roles.join(' | ')}</span></div><p className="hero-description">{p.intro}</p><div className="hero-actions"><Button asChild size="lg"><a href="#projects">{p.labels.viewProjects}<ArrowUpRight/></a></Button><Button asChild size="lg" variant="outline"><a href="#about">{p.labels.aboutMe}<ArrowRight/></a></Button><Button asChild size="lg" variant="ghost"><a href={p.contact.linkedin ?? 'https://www.linkedin.com/in/karthick-a-in'} aria-label="Visit LinkedIn profile" target="_blank" rel="noreferrer"><Linkedin/><span>LinkedIn</span><ArrowUpRight/></a></Button><Button asChild size="lg" variant="ghost"><a href={p.contact.github ?? 'https://github.com/karthickanbu1'} aria-label="Visit GitHub profile" target="_blank" rel="noreferrer"><Github/><span>GitHub</span><ArrowUpRight/></a></Button><Button asChild size="lg" variant="ghost"><a href={`mailto:${p.contact.email ?? 'karthickanbu81@gmail.com'}`} aria-label="Email Karthick A"><Mail/><span>Email</span><ArrowUpRight/></a></Button></div></div>
          <div className="hero-visual">
            <div className="hero-art-panel">
              <ElectricLogo
                src="/logo.svg"
                color="#0b1117"
                glowColor="#78e7d5"
                scale={0.7}
                strands={4}
                bend={0.55}
                crackle={2}
                arcs={1.5}
                speed={2.5}
                interactive
                intensity={1.2}
                glow={0.18}
                thickness={2}
                flicker={0.5}
                fill={0}
                cursorIntensity={1.05}
                cursorRadius={100}
              />
              <Dialog>
                <DialogTrigger asChild>
                  <button className="hero-art-cta" type="button">
                    <span>Scared to click me?</span>
                    <span>Go on — try it <ArrowUpRight size={14}/></span>
                  </button>
                </DialogTrigger>
                <DialogContent className="prank-modal">
                  <DialogHeader>
                    <p className="prank-terminal-label">SYSTEM ALERT <span>///</span> 0x01</p>
                    <DialogTitle className="prank-title">HA! YOU GOT HACKED.</DialogTitle>
                    <DialogDescription className="prank-disclaimer">
                      Just kidding, buddy — you’re safe. This was only a harmless portfolio prank.
                    </DialogDescription>
                  </DialogHeader>
                  <p className="prank-message">Since you made it this far, let’s connect instead.</p>
                  <div className="prank-social-actions">
                    <Button asChild size="lg" variant="outline">
                      <a href={p.contact.github ?? 'https://github.com/karthickanbu1'} target="_blank" rel="noreferrer"><Github/> GitHub <ArrowUpRight/></a>
                    </Button>
                    <Button asChild size="lg">
                      <a href={p.contact.linkedin ?? 'https://www.linkedin.com/in/karthick-a-in'} target="_blank" rel="noreferrer"><Linkedin/> LinkedIn <ArrowUpRight/></a>
                    </Button>
                  </div>
                  <p className="prank-footnote">NO DATA ACCESSED · NO HACKING · JUST GOOD VIBES</p>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <div className="container hero-bottom"><a href="#about" className="scroll-indicator" aria-label="Scroll to About"><ArrowDown size={17}/><span>01 — 05</span></a><div className="hero-stack-label"><Code2 size={15}/><span>Python</span><span>React</span><span>FastAPI</span><span>AI Agents</span></div></div>
      </section>
      <section id="about" className="section"><div className="container"><SectionHeading number="01" label="ABOUT ME" title={p.aboutHeading}/><div className="about-grid"><Reveal className="photo-placeholder"><div className="photo-frame"><DitherVeil src="https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop" className="photo-dither" pattern="noise" pixelSize={1} inkColor="#120f17" paperColor="#f4f1ea" revealRadius={245} softness={0.85} linger={2.2} contrast={1.6} brightness={-0.06} reverse wander/></div><div className="photo-caption"><Braces size={19}/><span>{p.name}</span><span className="text-secondary font-mono">&lt;/&gt;</span></div></Reveal><Reveal><h3 className="journey-title">{p.journeyHeading}</h3><div className="journey-list">{p.journey.map((j,i)=><div key={j} className="journey-item"><span className="journey-icon">{i<3?<BriefcaseBusiness size={17}/>:<GraduationCap size={18}/>}</span><p>{j}</p></div>)}</div></Reveal></div><Reveal className="stats-row">{p.stats.map(s=><div key={s.label}><strong><Count value={s.label==='Months Experience'&&asOfDate?p.experience.reduce((total,e)=>total+monthsInclusive(e.startMonth,e.endMonth??currentMonthKey(asOfDate)),0):s.value} suffix={s.suffix}/></strong><span>{s.label}</span></div>)}</Reveal></div></section>
      <section id="skills" className="section section-tinted"><div className="container"><SectionHeading number="02" label="THE TOOLKIT" title={p.skillsHeading}/><div className="skills-grid">{p.skills.map((s,i)=>{const Icon=skillIcons[i] ?? Code2;return <Reveal key={s.name} className="skill"><div className="skill-label"><span className="flex items-center gap-3"><Icon size={20}/>{s.name}</span><span className="font-mono text-muted-foreground">{s.value}<small>%</small></span></div><div className="skill-track"><motion.div initial={{width:reduced?`${s.value}%`:0}} whileInView={{width:`${s.value}%`}} viewport={{once:true}} transition={{duration:reduced?0:1}} className="skill-fill"/></div></Reveal>;})}</div></div></section>
      <section id="experience" className="section"><div className="container"><SectionHeading number="03" label="EXPERIENCE" title={p.experienceHeading}/><div className="timeline" ref={timelineRef}><motion.div className="timeline-progress" style={{scaleY:reduced?1:timelineProgress}} aria-hidden="true"/>{p.experience.map((e,i)=><motion.div key={e.company} data-story-step={i+1} className="timeline-entry" initial={reduced?false:{opacity:0,y:46,filter:'blur(7px)'}} whileInView={{opacity:1,y:0,filter:'blur(0px)'}} viewport={{once:true,amount:0.22}} transition={{duration:reduced?0:0.78,delay:reduced?0:Math.min(i*0.08,0.24),ease:[0.22,1,0.36,1]}}><div className="timeline-marker"><BriefcaseBusiness size={17}/></div><div className="experience-card"><div className="experience-top"><div className="experience-meta"><span className="experience-chapter">CHAPTER {String(i+1).padStart(2,'0')}</span><span className="font-mono text-secondary">{e.date}</span></div><span className="duration">{e.endMonth===null&&asOfDate?`${monthsInclusive(e.startMonth,currentMonthKey(asOfDate))} months`:e.duration}</span></div><h3>{e.role}</h3><h4>{e.company}</h4><p className="experience-description">{e.description}</p><h5>{p.labels.achievements}</h5><ul>{e.achievements.map(a=><li key={a}>{a}</li>)}</ul><Tags items={e.tech}/></div></motion.div>)}</div></div></section>
      <section id="projects" className="section"><div className="container"><SectionHeading number="04" label="SELECTED WORK" title={p.projectsHeading}/>{p.filters.length>0&&<div className="filter-bar" role="tablist" aria-label="Project category">{p.filters.map(f=><Button key={f} variant="ghost" role="tab" aria-selected={filter===f} className={filter===f?'selected-filter':''} onClick={()=>setFilter(f)}>{f}</Button>)}</div>}<Reveal className="featured-project"><div className="featured-heading"><div className="eyebrow text-secondary"><Layers3 size={16}/> FEATURED CASE STUDY</div><span className="font-mono text-muted-foreground">01 / OSPIRA</span></div><h3>{p.featured.title}</h3><Tags items={p.featured.tech}/><div className="problem-solution"><div><h4>{p.labels.problem}</h4><p>{p.featured.problem}</p></div><div><h4 className="text-secondary">{p.labels.solution}</h4><p>{p.featured.solution}</p></div></div><div className="project-stats">{p.featured.stats.map(s=><div key={s.label}><strong><Count value={s.value} suffix={s.suffix}/></strong><span>{s.label}</span></div>)}</div><Dialog><DialogTrigger asChild><Button variant="outline">{p.labels.architecture}<ArrowUpRight/></Button></DialogTrigger><DialogContent className="architecture-modal"><DialogHeader><DialogTitle>OSPIRA — {p.labels.architecture}</DialogTitle><DialogDescription>{p.featured.title}</DialogDescription></DialogHeader><div className="architecture-flow">{p.featured.architecture.map((n,i)=><div key={n} className="architecture-step"><div className="architecture-node">{i===0?<Atom/>:i===1?<Terminal/>:<Workflow/>}<span>{n}</span></div><ArrowDown className="text-secondary"/></div>)}<div className="architecture-services">{p.featured.services.map(n=><div key={n} className="architecture-node"><Database size={18}/>{n}</div>)}</div></div></DialogContent></Dialog></Reveal>
      <h3 className="subsection-heading deep-dive-heading">Engineering Deep Dives<span className="font-mono">/ {String(p.engineeringProjects.length).padStart(2,'0')}</span></h3><div className="deep-dive-grid">{p.engineeringProjects.map((project,i)=><Reveal key={project.title} className="deep-dive-card"><div className="deep-dive-meta"><span>{project.discipline}</span><span className="font-mono">0{i+1}</span></div><h4>{project.title}</h4><p>{project.description}</p><Tags items={project.tech}/></Reveal>)}</div>
      <h3 className="subsection-heading">{p.labels.features}<span className="font-mono">/ {String(p.features.filter(f=>filter==='All'||f.category===filter).length).padStart(2,'0')}</span></h3><div className="features-grid">{p.features.map((f,i)=>{if(filter!=='All'&&f.category!==filter)return null;const Icon=featureIcons[i] ?? Layers3;const open=expanded.includes(i);return <Reveal key={f.title} className={`feature-card ${open?'feature-open':''}`}><Button variant="ghost" className="feature-trigger" aria-expanded={open} aria-controls={`feature-${i}`} onClick={()=>setExpanded(v=>open?v.filter(n=>n!==i):[...v,i])}><Icon size={21}/><span>{f.title}</span><ChevronDown className={open?'rotate-180':''}/></Button><p id={`feature-${i}`} className={open?'feature-text expanded':'feature-text'}>{f.text}</p></Reveal>;})}</div>
      <h3 className="subsection-heading">{p.labels.applications}</h3><div className="applications-grid">{p.applications.map((a,i)=>{if(filter!=='All'&&!a.categories.includes(filter))return null;const Icon=appIcons[i] ?? Globe;return <Reveal key={a.title} className="application-card"><div className="flex justify-between items-center"><span className="tile-icon"><Icon size={22}/></span><span className="coming-soon"><LockKeyhole size={11}/>{p.labels.comingSoon}</span></div><h4>{a.title}</h4><p>{a.text}</p><Tags items={a.tech}/><Button disabled variant="ghost" className="app-button" aria-label={`${a.title} — Coming Soon`}>{p.labels.comingSoon}<ArrowUpRight/></Button></Reveal>;})}</div></div></section>
      <section id="contact" className="section section-tinted"><div className="container contact-grid"><Reveal><div className="eyebrow"><span>05 /</span> CONTACT</div><h2 className="contact-heading">{p.contact.heading}</h2><div className="contact-details"><div><Mail size={19}/>{p.contact.email?<a href={`mailto:${p.contact.email}`}>{p.contact.email}</a>:<span>{p.labels.email}</span>}</div><div><MapPin size={19}/>{p.contact.location}</div></div><div className="flex gap-3 mt-8">{[{url:p.contact.github,label:p.labels.github,Icon:Github},{url:p.contact.linkedin,label:p.labels.linkedin,Icon:Linkedin}].map(({url,label,Icon})=>url?<Button key={label} asChild size="icon" variant="outline"><a href={url} aria-label={label} target="_blank" rel="noreferrer"><Icon/></a></Button>:<Button key={label} disabled size="icon" variant="outline" aria-label={label} title={label}><Icon/></Button>)}</div></Reveal><Reveal><form onSubmit={submit} className="contact-form"><div className="form-row"><label>{p.labels.name}<input name="name" autoComplete="name" required placeholder="Your name"/></label><label>{p.labels.emailField}<input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></label></div><label>{p.labels.message}<textarea name="message" rows={5} required placeholder="Your message"/></label><Button type="submit" size="lg">{p.labels.send}<Send/></Button>{feedback&&<p role="status" className="form-feedback">{feedback}</p>}</form></Reveal></div></section>
    </main><footer><div className="container footer-inner"><a href="#" className="brand"><span className="brand-mark"><Braces size={19}/></span>{p.name}<span className="text-primary">.</span></a><span>{p.copyright}</span><Button variant="outline" size="icon" asChild><a href="#" aria-label="Back to top" title="Back to top"><ArrowUp/></a></Button></div></footer>
  </div>;
}
