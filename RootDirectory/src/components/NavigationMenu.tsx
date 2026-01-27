import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CirclePower, User, Folder, Code, Brain, Bot, Gamepad2 } from 'lucide-react';


interface MenuItem {
  label: string;
  path: string;
  icon: JSX.Element;
}


const NavigationMenu = () => {
  const navigate = useNavigate();
  const [cyberLines, setCyberLines] = useState<
    { x: number; opacity: number; length: number; rotation: number; speed: number }[]
  >([]);

  useEffect(() => {
    const generateCyberLines = () => {
      const lines = Array.from({ length: 40 }, () => ({
        x: Math.random() * 100,
        opacity: Math.random() * 0.4,
        length: Math.random() * 150 + 50,
        rotation: Math.random() * 90,
        speed: Math.random() * 5 + 2,
      }));
      setCyberLines(lines);
    };
    generateCyberLines();
    const interval = setInterval(generateCyberLines, 5000);
    return () => clearInterval(interval);
  }, []);

  const location = useLocation();
  const activeItem = location.pathname;

  const menuItems: MenuItem[] = [
    { label: 'Home', path: '/', icon: <CirclePower size={20} /> },
    { label: 'About', path: '/about', icon: <User size={20} /> },
    { label: 'Projects', path: '/projects', icon: <Folder size={20} /> },
    { label: 'Skills', path: '/skills', icon: <Brain size={20} /> },
    { label: 'AI', path: '/AIAssistant', icon: <Bot size={20} /> },
    { label: 'SkillGame', path: '/skill-game', icon: <Gamepad2 size={20} /> },
  ];


  const handleNavigation = (path: string) => {
  navigate(path);
};


  return (
    <nav
      className="
        fixed z-[9999] bg-black overflow-hidden
        md:top-0 md:left-0 md:h-screen md:w-24 md:flex-col md:py-8 md:border-r-2 md:border-primary/30
        bottom-0 left-0 h-16 w-full flex flex-row items-center justify-center border-t-2 border-primary/30 md:justify-start md:items-center
      "
    >
      {/* Cyber Lines - behind everything */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {cyberLines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: line.x - 20, rotate: line.rotation }}
            animate={{
              opacity: [0, line.opacity, 0],
              x: [line.x - 20, line.x, line.x + 20],
              rotate: [line.rotation, line.rotation + 10, line.rotation - 10],
            }}
            transition={{
              duration: line.speed,
              repeat: Infinity,
              repeatType: 'loop',
              delay: index * 0.1,
            }}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${line.x}%`,
              width: `${line.length}px`,
              height: '1px',
              backgroundColor: 'rgba(0, 255, 209, 0.2)',
              transform: `rotate(${line.rotation}deg)`,
            }}
          />
        ))}
      </div>

      {/* Menu Items */}
<div className="flex relative z-10 w-full h-full 
  flex-row justify-evenly items-center  /* mobile: centered */
  md:flex-col md:gap-6 md:items-center md:h-auto md:w-auto"
>
  {menuItems.map((item) => (
    <motion.div
      key={item.path}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group flex flex-col items-center md:items-center w-10 md:w-auto"
    >
      <button
        onClick={() => handleNavigation(item.path)}
        className={`
          group flex items-center justify-center w-10 h-10 md:w-12 md:h-12 transition-all duration-300 relative overflow-hidden border-2
          ${activeItem === item.path
            ? 'border-secondary text-secondary shadow-[0_0_10px_rgba(255,20,147,0.5)]'
            : 'border-primary/50 text-primary hover:border-secondary hover:text-secondary'}
          hover:shadow-[0_0_10px_rgba(255,20,147,0.3)]
          rounded-none bg-black
          focus:outline-none
        `}
        style={{ position: 'relative', zIndex: 20 }}
      >
        {/* Icon */}
        <div className="relative z-20 flex items-center justify-center w-6 h-6">
          {React.cloneElement(item.icon, { className: 'inline-block align-middle' })}
        </div>

        {/* Active Indicator */}
       <AnimatePresence>
  {activeItem === item.path && (
    <motion.div
      layoutId="active-indicator"
      initial={{ width: 0, height: 2 }}
      animate={{
        width: '100%', // <-- make it full width
        height: '2px',
        transition: { duration: 10, repeat: Infinity, repeatType: 'reverse' },
      }}
      exit={{ width: 0 }} // makes it disappear when unselected
      className="
        absolute 
        bottom-0 left-0
        bg-secondary
        z-10
      "
    />
  )}
</AnimatePresence>

      </button>

      {/* Label */}
      <span className="block font-press-start text-[8px] text-primary/70 mt-1 md:mt-1 text-center md:text-center relative z-20">
        {item.label}
      </span>
    </motion.div>
  ))}
</div>

    </nav>
  );
};

export default NavigationMenu;
