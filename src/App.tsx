/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Network, Globe, MapPin, Calendar, X, ChevronLeft, ChevronRight, ArrowUp, Linkedin, Facebook, Github, Instagram, Send, Mail, Phone, Volume2, VolumeX } from "lucide-react";
import Lenis from 'lenis';

const PROJECTS = [
  {
    id: "01",
    title: "LifeSights",
    overview: "A smart analytics dashboard designed to make sense of your data. It connects directly to Google Drive, allowing you to easily analyze Excel or Google Sheets with the help of KPI cards, interactive charts, and an AI assistant that answers your specific data questions.",
    images: [
      "/Public/LifeSights/1st.jpeg",
      "/Public/LifeSights/WhatsApp Image 2026-05-08 at 1.09.46 PM (1).jpeg",
      "/Public/LifeSights/WhatsApp Image 2026-05-08 at 1.09.46 PM.jpeg",
      "/Public/LifeSights/WhatsApp Image 2026-05-08 at 1.09.47 PM.jpeg",
      "/Public/LifeSights/WhatsApp Image 2026-05-08 at 1.09.48 PM.jpeg"
    ]
  },
  {
    id: "02",
    title: "Lifewood",
    overview: "A digital showcase for Lifewood, a global leader in AI data services. This project highlights their expertise in data annotation and LLM training, helping tell the story of their massive global network of delivery centers and multilingual data solutions.",
    images: [
      "/Public/Lifewood/LW 1.png",
      "/Public/Lifewood/LW 2.png",
      "/Public/Lifewood/LW 3.png",
      "/Public/Lifewood/LW 4.png"
    ]
  },
  {
    id: "03",
    title: "Break-in",
    overview: "A first-person psychological horror experience that follows the story of Victor, a father willing to risk everything to save his son. Players explore a cursed atmosphere, solving puzzles while avoiding a dangerous presence in a struggle for survival.",
    images: [
      "/Public/Break-in/1st.jpeg",
      "/Public/Break-in/WhatsApp Image 2026-05-08 at 2.59.13 PM (1).jpeg",
      "/Public/Break-in/WhatsApp Image 2026-05-08 at 2.59.14 PM (1).jpeg",
      "/Public/Break-in/WhatsApp Image 2026-05-08 at 2.59.14 PM (2).jpeg",
      "/Public/Break-in/WhatsApp Image 2026-05-08 at 2.59.14 PM.jpeg"
    ]
  },
  {
    id: "04",
    title: "WisEnergy",
    overview: "A helpful mobile app built to help families save energy. By tracking usage in real-time and providing AI-powered tips, it helps make homes more efficient and mindful of their impact through smart IoT integration.",
    images: [
      "/Public/WisEnergy/1st.png",
      "/Public/WisEnergy/Appliances.png",
      "/Public/WisEnergy/Budget.png",
      "/Public/WisEnergy/Dashboard 2.png",
      "/Public/WisEnergy/Devices.png",
      "/Public/WisEnergy/Reports (2) - Copy.png",
      "/Public/WisEnergy/Reports a bugs.png"
    ]
  }
];

export default function App() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);
  const [showResume, setShowResume] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isIntroComplete && audioRef.current && !isMuted) {
      audioRef.current.play().catch(err => {
        console.log("Autoplay blocked or audio error:", err);
      });
    }
  }, [isIntroComplete, isMuted]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(console.error);
        audioRef.current.muted = false;
      } else {
        audioRef.current.muted = true;
      }
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    lenisRef.current = lenis;

    // Handle anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.hash && link.origin === window.location.origin) {
        e.preventDefault();
        const element = document.querySelector(link.hash) as HTMLElement;
        if (element) {
          // Calculate offset to center the section if it fits, otherwise scroll to top with a slight offset
          const viewportHeight = window.innerHeight;
          const elementHeight = element.offsetHeight;
          const offset = elementHeight < viewportHeight 
            ? -(viewportHeight - elementHeight) / 2 
            : -40; // Small padding for large sections

          lenis.scrollTo(element, { offset });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProject || showResume) {
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "Escape") {
          setSelectedProject(null);
          setShowResume(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroComplete(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-brand-black text-white relative">
      <audio 
        ref={audioRef}
        src="/Public/Music/Kendrick%20Lamar%20%20Chapter%20Six%20%5BInstrumental%5D.mp3"
        loop
        muted={isMuted}
      />

      {/* Music Toggle */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.5 }}
        onClick={toggleMute}
        className="fixed top-6 right-6 z-[80] w-10 h-10 border border-brand-yellow/30 bg-brand-black/50 backdrop-blur-md flex items-center justify-center text-brand-yellow hover:bg-brand-yellow hover:text-brand-black transition-all group"
        title={isMuted ? "Unmute Music" : "Mute Music"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        <span className="absolute right-full mr-3 px-2 py-1 bg-brand-yellow text-brand-black text-[9px] font-bold uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {isMuted ? "MUTED" : "SOUND ON"}
        </span>
      </motion.button>
      <AnimatePresence mode="wait">
        {!isIntroComplete && (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
            }}
            className="fixed inset-0 z-[200] bg-brand-black flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Split Screen Wipe Background */}
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-brand-yellow/5 origin-left"
            />

            <div className="relative z-10 text-center space-y-8">
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="text-brand-yellow font-mono text-[10px] md:text-sm font-bold uppercase tracking-[0.4em]">Portfolio 2026</span>
                </motion.div>
              </div>

              <div className="relative">
                <motion.h1 
                  className="text-white font-display text-6xl md:text-9xl uppercase tracking-tighter leading-none"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="block italic opacity-40 text-4xl md:text-6xl mb-2">Gerard Luis</span>
                  <span className="block">Mandado</span>
                </motion.h1>

                {/* Glitchy Scanline Effect */}
                <motion.div 
                  className="absolute inset-0 bg-brand-yellow/10 h-[1px] top-1/2"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <div className="flex justify-center gap-12 mt-12 overflow-hidden">
                {["Designer", "Developer", "Network"].map((role, i) => (
                  <motion.span
                    key={role}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                    className="text-white/40 font-mono text-[9px] uppercase tracking-widest"
                  >
                    {role}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-12 left-12 right-12 w-[calc(100%-96px)] h-[1px] bg-white/10">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2, ease: "linear" }}
                className="h-full bg-brand-yellow origin-left"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Background Marquee - Fixed & Optimized */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex flex-col justify-between opacity-[0.15]">
        <div className="noise-overlay opacity-[0.4]"></div>
        <div className="flex animate-marquee whitespace-nowrap py-12">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="text-[15vw] font-display uppercase mr-24">GERARD MANDADO • </span>
          ))}
        </div>
        <div className="flex animate-marquee-reverse whitespace-nowrap self-end py-12">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="text-[15vw] font-display uppercase mr-24">GERARD MANDADO • </span>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isIntroComplete ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="min-h-screen flex flex-col items-center justify-center p-4 md:p-12 relative"
      >
        <motion.div 
          id="intro"
        initial={{ opacity: 0, y: 50 }}
        animate={isIntroComplete ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-[92%] max-w-[1080px] bg-brand-yellow p-8 md:p-12 relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] my-8"
      >
        <div className="relative">
          {/* Navigation Links */}
          <div className="absolute -top-4 -left-4">
            <nav className="flex flex-wrap gap-4 md:gap-10">
              {["Intro", "About Me", "Projects", "Experience", "Contact"].map((item, i) => (
                <motion.a 
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`} 
                  initial={{ opacity: 0, y: -10 }}
                  animate={isIntroComplete ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + (i * 0.1) }}
                  className="text-brand-black font-display text-base md:text-xl tracking-tighter hover:opacity-70 transition-opacity uppercase"
                >
                  {item}
                </motion.a>
              ))}
            </nav>
          </div>

          <div className="flex flex-col">
            {/* The Main Content Box (The Image with Overlays) */}
            <div className="ml-0 lg:ml-12 mt-8 relative max-w-[85%]">
              <div className="w-full aspect-[16/9] md:aspect-[16/8] bg-brand-black relative overflow-hidden">
                {/* Noise inside black box only */}
                <div className="noise-overlay"></div>
                {/* The Image - Larger, aligned left, reaching towards the top */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-start">
                  <motion.img 
                    src="/Public/Other images/1.png" 
                    alt="Gerard Mandado" 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={isIntroComplete ? { scale: 1, opacity: 0.7 } : {}}
                    transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                    className="h-[120%] w-auto object-cover object-left-bottom grayscale brightness-95 contrast-125 translate-y-[5%]"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop";
                    }}
                  />
                </div>
                
                {/* Content Overlay Grid */}
                <div className="absolute inset-0 p-6 md:p-12 font-mono flex flex-col justify-between z-10">
                  {/* Top Row - Bio pushed to the right */}
                  <div className="grid grid-cols-12">
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={isIntroComplete ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="col-span-12 md:col-start-8 md:col-span-5 space-y-2 text-right"
                    >
                      <span className="text-brand-yellow text-[10px] font-bold">INFO</span>
                      <p className="text-white text-[10px] md:text-[11px] leading-[1.4] tracking-tight">
                        I'm Gerard, a networking specialist and web developer dedicated to building reliable digital experiences. Based in Lapu-Lapu City, I focus on creating systems that work seamlessly behind the scenes.
                      </p>
                    </motion.div>
                  </div>

                  {/* Middle Row - Skills pushed right */}
                  <div className="grid grid-cols-12">
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={isIntroComplete ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      className="col-span-12 md:col-start-9 md:col-span-4 text-right"
                    >
                      <span className="text-brand-yellow text-[10px] font-bold mb-4 block">SKILLS</span>
                      <ul className="text-white text-[11px] md:text-[12px] md:leading-[1.1] uppercase flex flex-col items-end gap-1 tracking-[0.2em] font-bold">
                        {["Networking", "Full Stack", "Web Architecture", "Cloud Infrastructure"].map((skill, index) => (
                          <motion.li 
                            key={skill}
                            initial={{ opacity: 0, x: 10 }}
                            animate={isIntroComplete ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.4, delay: 1 + (index * 0.1) }}
                          >
                            {skill}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex justify-between items-end">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={isIntroComplete ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 1.2 }}
                      className="space-y-1"
                    >
                      <span className="text-brand-yellow text-[10px] font-bold">STORY</span>
                      <p className="text-white text-[11px] font-bold uppercase tracking-tighter">EST. 2001</p>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={isIntroComplete ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 1.3 }}
                      className="text-right"
                    >
                      <span className="text-brand-yellow text-[10px] font-bold">ROLES</span>
                      <p className="text-white text-[10px] md:text-[11px] leading-none uppercase font-bold mt-1">
                        Network Administrator<br/>
                        Web Developer<br/>
                        Operational Security<br/>
                        Security Inspector
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Large Footer Title */}
            <div className="mt-6 md:mt-10 relative py-2 overflow-hidden">
              <motion.div 
                initial={{ y: "100%" }}
                animate={isIntroComplete ? { y: 0 } : {}}
                transition={{ duration: 1, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="noise-overlay opacity-[0.2] z-20"></div>
                <h1 className="text-brand-black font-display text-[14vw] md:text-[11vw] lg:text-[9.5vw] leading-[0.75] tracking-tighter uppercase relative z-10">
                  GERARD MANDADO
                </h1>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* About Me Section - Flush Integration */}
      <motion.div 
        id="about-me"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-[92%] max-w-[1080px] bg-brand-black relative z-10 shadow-[0_0_80px_rgba(0,0,0,0.5)] mb-8 overflow-hidden border border-brand-yellow/10 group"
      >
        <div className="noise-overlay opacity-[0.2]"></div>
        
        {/* Integrated Background Image - Right Column (Seamless) */}
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full z-0 overflow-hidden pointer-events-none">
          {/* Default Image */}
          <img 
            src="/Public/Other images/2X2.png" 
            className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-[1.1] opacity-90 mix-blend-screen transition-all duration-700 scale-[1.2] group-hover:opacity-0" 
            alt="Gerard Luis Mandado"
          />
          {/* Hover Image */}
          <img 
            src="/Public/Other images/1-1.png" 
            className="absolute inset-0 w-full h-full object-cover object-[center_20%] grayscale contrast-[1.1] opacity-0 mix-blend-screen transition-all duration-700 scale-[1.2] group-hover:opacity-90" 
            alt="Gerard Luis Mandado Hover"
          />
          {/* Edge softening for true integration */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-brand-black items-end z-10"></div>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-brand-black to-transparent z-10 hidden lg:block"></div>
        </div>

        <div className="relative z-10 p-6 md:p-10 lg:p-16 min-h-[480px] flex flex-col justify-center">
          <div className="w-full lg:w-[55%] space-y-6">
            <div className="flex gap-2 items-center">
              <span className="text-brand-black bg-brand-yellow px-2 py-0.5 text-[10px] font-bold">HELLO</span>
              <h2 className="text-brand-yellow font-mono text-xs font-bold uppercase tracking-widest underline decoration-brand-yellow/40 decoration-2 underline-offset-4">About Me</h2>
            </div>
            
            <h3 className="text-white font-display text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter leading-none">
              Gerard Luis Mandado
            </h3>
            
            <div className="space-y-4 font-mono text-xs md:text-sm text-white/80 leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                I'm based in Lapu-Lapu City, Philippines, working at the edge of network engineering and web design. I focus on creating digital systems that aren't just beautiful, but built to last.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="opacity-70"
              >
                With a background in both hardware and software, I bridge the gap between technical complexity and intuitive user experiences. My goal is to build tools that are resilient, scalable, and helpful.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="opacity-50 italic"
              >
                When I'm not solving technical puzzles, I love to explore new horizons, try different experiences, and dive into video games.
              </motion.p>
            </div>

            <div className="pt-6 flex flex-wrap lg:flex-nowrap items-stretch gap-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="border border-brand-yellow/20 px-4 py-2 bg-brand-yellow/[0.03] backdrop-blur-sm whitespace-nowrap"
              >
                <span className="block text-[8px] font-bold text-brand-yellow/50 uppercase mb-1">Located in</span>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">CEBU, PHILIPPINES</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="border border-brand-yellow/20 px-4 py-2 bg-brand-yellow/[0.03] backdrop-blur-sm whitespace-nowrap"
              >
                <span className="block text-[8px] font-bold text-brand-yellow/50 uppercase mb-1">Main Focus</span>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">FULL STACK & NETWORK SYSTEMS</span>
              </motion.div>
                <motion.button 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  onClick={() => setShowResume(true)}
                  className="border border-brand-yellow/30 px-6 bg-brand-yellow/[0.05] backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-brand-yellow/[0.15] hover:border-brand-yellow/50 group/resume flex items-center justify-center min-h-[46px] whitespace-nowrap"
                >
                  <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em] group-hover/resume:text-brand-yellow transition-colors">VIEW RESUME</span>
                </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    
      {/* Projects Section - New Container */}
      <motion.div 
        id="projects"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-[92%] max-w-[1080px] bg-white p-8 md:p-12 relative z-10 shadow-[0_0_80px_rgba(0,0,0,0.1)] mb-8"
      >
        <div className="noise-overlay opacity-[0.05]"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-12">
            <div className="flex gap-2 items-center">
              <span className="text-white bg-brand-black px-2 py-0.5 text-[10px] font-bold">PROJECTS</span>
              <h2 className="text-brand-black font-mono text-xs font-bold uppercase tracking-widest">Featured Projects // 2024-2026</h2>
            </div>
            <div className="hidden md:block text-brand-black/40 font-mono text-[10px] uppercase tracking-widest">
              Digital Solutions & Design
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {PROJECTS.map((project, index) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ x: 8 }}
                onClick={() => {
                  setSelectedProject(project);
                  setCurrentImageIndex(0);
                }}
                className="group cursor-pointer"
              >
                <div className="flex gap-4 items-start mb-4">
                  <span className="text-brand-black font-mono text-[10px] font-bold opacity-30 mt-1">{project.id}</span>
                  <div className="flex-1">
                    <h3 className="text-brand-black font-display text-2xl md:text-3xl leading-none uppercase tracking-tight group-hover:text-brand-yellow transition-colors duration-300">
                      {project.title}
                    </h3>
                    <div className="w-full h-[1px] bg-brand-black/10 mt-3 scale-x-100 group-hover:bg-brand-black/30 transition-colors"></div>
                  </div>
                </div>
                <div className="pl-8">
                  <p className="text-brand-black/70 font-mono text-[10px] md:text-[11px] leading-[1.6] max-w-sm group-hover:text-brand-black transition-colors">
                    {project.overview}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Experience Section */}
      <motion.div 
        id="experience"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-[92%] max-w-[1080px] bg-brand-yellow p-8 md:p-12 relative z-10 shadow-[0_0_60px_rgba(0,0,0,0.2)] mb-8"
      >
        <div className="noise-overlay opacity-[0.1]"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-2 items-center">
              <span className="text-white bg-brand-black px-2 py-0.5 text-[10px] font-bold">CAREER</span>
              <h2 className="text-brand-black font-mono text-xs font-bold uppercase tracking-widest">My Career Journey</h2>
            </div>
          </div>

          <div className="space-y-8">
            {[
              {
                role: "Operation/Inspector",
                company: "PROBE SECURITY AGENCY, INC.",
                description: "Leading oversight and inspections for security operations. I focus on keeping teams coordinated and operations running smoothly to ensure the highest standards of safety and reliability.",
                timeline: "June 2023 — Current"
              },
              {
                role: "Intern",
                company: "Lifewood Data Technology",
                description: "Supported large-scale digital projects during my time here. I helped optimize workflows and improved documentation to help the team deliver high-quality data solutions efficiently.",
                timeline: "Jan 2026 — May 2026"
              }
            ].map((exp, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex flex-col md:flex-row md:justify-between items-start border-b border-brand-black/20 pb-6 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-brand-black font-display text-2xl md:text-3xl uppercase tracking-tighter">{exp.role}</h3>
                    <span className="text-[10px] font-mono border border-brand-black/20 px-2 py-0.5 rounded-full uppercase">{exp.company}</span>
                  </div>
                  <p className="text-brand-black/70 font-mono text-[10px] md:text-[11px] leading-relaxed max-w-2xl">
                    {exp.description}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <span className="text-brand-black font-mono text-xs font-bold block italic uppercase opacity-60">Timeline</span>
                  <span className="text-brand-black font-mono text-[10px] block opacity-40">{exp.timeline}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div 
        id="contact"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-[92%] max-w-[1080px] bg-brand-black relative z-10 shadow-[0_0_80px_rgba(0,0,0,0.5)] mb-20 overflow-hidden border border-brand-yellow/10"
      >
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex gap-2 items-center mb-12">
            <span className="text-brand-black bg-brand-yellow px-2 py-0.5 text-[10px] font-bold">CONNECT</span>
            <h2 className="text-brand-yellow font-mono text-xs font-bold uppercase tracking-widest underline decoration-brand-yellow/40 decoration-2 underline-offset-4">Let's Talk</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info & Socials */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div>
                <h3 className="text-white font-display text-4xl md:text-5xl uppercase tracking-tighter leading-none mb-6">
                  Get in <span className="text-brand-yellow">Touch</span>
                </h3>
                <p className="text-white/60 font-mono text-xs md:text-sm max-w-md leading-relaxed">
                  I'm currently open for new opportunities and collaborations. Whether you have a project in mind or just want to say hello, feel free to reach out.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { icon: <Mail size={18} />, label: "Email", value: "gerardmandado@gmail.com", href: "mailto:gerardmandado@gmail.com" },
                  { icon: <Phone size={18} />, label: "Contact No.", value: "09325062156", href: "tel:09325062156" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                    className="flex items-center gap-4 text-white group"
                  >
                    <div className="w-10 h-10 border border-brand-yellow/20 flex items-center justify-center bg-brand-yellow/5 group-hover:bg-brand-yellow group-hover:text-brand-black transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <span className="block text-[8px] font-bold text-brand-yellow/50 uppercase">{item.label}</span>
                      <a href={item.href} className="text-sm font-mono hover:text-brand-yellow transition-colors tracking-tight">{item.value}</a>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div>
                <span className="block text-[10px] font-bold text-brand-yellow uppercase mb-6 tracking-[0.2em] opacity-40">Find Me On</span>
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: <Linkedin size={20} />, label: "LinkedIn", href: "https://www.linkedin.com/in/gerard-luis-mandado-7143443a5/" },
                    { icon: <Facebook size={20} />, label: "Facebook", href: "https://www.facebook.com/gerardluisbaclayon.mandado" },
                    { icon: <Github size={20} />, label: "GitHub", href: "https://github.com/GerardLuisMandado" },
                    { icon: <Instagram size={20} />, label: "Instagram", href: "https://www.instagram.com/gerard_mandado/" }
                  ].map((social, index) => (
                    <motion.a 
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
                      className="w-12 h-12 border border-brand-yellow/20 flex items-center justify-center text-white bg-brand-yellow/5 hover:bg-brand-yellow hover:text-brand-black transition-all group relative"
                    >
                      {social.icon}
                      <span className="absolute -top-8 bg-brand-yellow text-brand-black text-[9px] font-bold px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {social.label}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[9px] font-bold text-brand-yellow/50 uppercase tracking-widest ml-1">Name</label>
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      className="w-full bg-brand-yellow/5 border border-brand-yellow/20 p-4 font-mono text-xs text-white outline-none focus:border-brand-yellow/60 transition-colors uppercase placeholder:opacity-20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[9px] font-bold text-brand-yellow/50 uppercase tracking-widest ml-1">Email</label>
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      className="w-full bg-brand-yellow/5 border border-brand-yellow/20 p-4 font-mono text-xs text-white outline-none focus:border-brand-yellow/60 transition-colors uppercase placeholder:opacity-20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[9px] font-bold text-brand-yellow/50 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    rows={6}
                    placeholder="Write your message here..." 
                    className="w-full bg-brand-yellow/5 border border-brand-yellow/20 p-4 font-mono text-xs text-white outline-none focus:border-brand-yellow/60 resize-none transition-colors uppercase placeholder:opacity-20"
                  ></textarea>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-brand-yellow text-brand-black p-4 font-bold font-mono text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:translate-x-1 hover:-translate-y-1 transition-transform shadow-[4px_4px_0_rgba(255,255,255,0.1)] active:translate-x-0 active:translate-y-0"
                >
                  <Send size={16} />
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Resume Modal */}
      <AnimatePresence>
        {showResume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 p-4 md:p-8"
          >
            <div className="absolute inset-0 noise-overlay opacity-10"></div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl h-[90vh] bg-brand-black border border-brand-yellow/20 flex flex-col z-10"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-brand-yellow/10 flex justify-between items-center bg-brand-black">
                <div className="flex items-center gap-3">
                  <span className="text-brand-yellow font-mono text-[10px] font-bold uppercase tracking-widest">Document Viewer</span>
                  <div className="h-4 w-[1px] bg-brand-yellow/20"></div>
                  <span className="text-white font-display text-sm md:text-base uppercase tracking-tight">Resume- Gerard Luis Mandado.pdf</span>
                </div>
                <button 
                  onClick={() => setShowResume(false)}
                  className="w-8 h-8 flex items-center justify-center text-white hover:text-brand-yellow hover:bg-brand-yellow/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* PDF Container */}
              <div className="flex-1 bg-white/5 relative overflow-hidden">
                <iframe 
                  src="/Public/Resume-%20Gerard%20Luis%20Mandado.pdf#toolbar=0" 
                  className="w-full h-full border-none"
                  title="Resume Viewer"
                />
              </div>

              {/* Modal Footer */}
              <div className="p-3 border-t border-brand-yellow/10 bg-brand-black flex justify-end gap-4">
                <a 
                  href="/Public/Resume-%20Gerard%20Luis%20Mandado.pdf" 
                  download 
                  className="text-[10px] font-bold text-brand-yellow uppercase tracking-widest hover:underline"
                >
                  Download Original
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Slideshow Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 p-4 md:p-12"
          >
            <div className="noise-overlay opacity-10"></div>
            
            {/* Blurred Background Layer */}
            <div className="absolute inset-0 z-[101] overflow-hidden pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-cover bg-center blur-2xl scale-110"
                  style={{ backgroundImage: `url(${selectedProject.images[currentImageIndex]})` }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 flex items-center justify-center text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-brand-yellow hover:text-brand-black transition-all duration-300 z-[320] group"
              title="Close"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Navigation Controls */}
            <button 
              onClick={prevImage}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[120]"
            >
              <ChevronLeft size={48} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[120]"
            >
              <ChevronRight size={48} />
            </button>

            <div className="w-full max-w-6xl flex flex-col items-center justify-center gap-10 relative z-[110]">
              <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden flex items-center justify-center group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={selectedProject.images[currentImageIndex]}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="max-w-full max-h-full object-contain relative z-10 shadow-2xl"
                  />
                </AnimatePresence>
                
                {/* Image Counter Overlay */}
                <div className="absolute bottom-4 left-4 bg-brand-yellow text-brand-black px-3 py-1 font-mono text-[10px] font-bold z-20">
                  {currentImageIndex + 1} / {selectedProject.images.length}
                </div>
              </div>

              <div className="text-center space-y-4 max-w-3xl px-4 relative z-10">
                <h2 className="text-brand-yellow font-display text-4xl md:text-6xl uppercase tracking-tighter drop-shadow-lg">
                  {selectedProject.title}
                </h2>
                <div className="h-[2px] w-24 bg-brand-yellow mx-auto"></div>
                <p className="text-white font-mono text-sm md:text-base leading-relaxed drop-shadow-md">
                  {selectedProject.overview}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[90] bg-brand-yellow text-brand-black p-4 shadow-xl hover:-translate-y-1 active:translate-y-0 transition-transform group"
          >
            <div className="noise-overlay opacity-10"></div>
            <ArrowUp size={24} className="relative z-10" />
            <div className="absolute -top-1 -right-1 bg-white border border-brand-black text-[8px] font-bold px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              TOP
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Labeling for context */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-8 text-white/20 font-mono text-[10px] tracking-widest uppercase">
        <span>Portfolio 2026</span>
        <span>Gerard Mandado // All Rights Reserved</span>
      </div>
    </motion.div>
  </div>
);
}

