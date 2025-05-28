import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CirclePower, 
  User, 
  Folder, 
  Code 
} from 'lucide-react';

interface MenuItem {
  label: string;
  path: string;
  icon: JSX.Element;
}

const NavigationMenu = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>(window.location.pathname);
  const [cyberLines, setCyberLines] = useState<{ 
    x: number; 
    opacity: number; 
    length: number; 
    rotation: number;
    speed: number;
  }[]>([]);

  useEffect(() => {
    const generateCyberLines = () => {
      const lines = Array.from({ length: 40 }, () => ({
        x: Math.random() * 100,
        opacity: Math.random() * 0.4,
        length: Math.random() * 150 + 50,
        rotation: Math.random() * 90,
        speed: Math.random() * 5 + 2
      }));
      setCyberLines(lines);
    };

    generateCyberLines();
    const interval = setInterval(generateCyberLines, 5000);
    return () => clearInterval(interval);
  }, []);

  const menuItems: MenuItem[] = [
    {
      label: 'Home',
      path: '/',
      icon: <CirclePower size={20} />
    },
    {
      label: 'About',
      path: '/about',
      icon: <User size={20} />
    },
    {
      label: 'Projects',
      path: '/projects',
      icon: <Folder size={20} />
    },
    {
      label: 'Skills',
      path: '/skills',
      icon: <Code size={20} />
    }
  ];

  const handleNavigation = (path: string) => {
    setActiveItem(path);
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 h-screen w-24 bg-[#0B0C10] border-r-2 border-primary/30 flex flex-col items-center py-8 z-[9999] overflow-hidden">
      {/* Cyber Lines Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {cyberLines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ 
              opacity: 0, 
              x: line.x - 20,
              rotate: line.rotation
            }}
            animate={{ 
              opacity: [0, line.opacity, 0],
              x: [line.x - 20, line.x, line.x + 20],
              rotate: [line.rotation, line.rotation + 10, line.rotation - 10]
            }}
            transition={{
              duration: line.speed,
              repeat: Infinity,
              repeatType: "loop",
              delay: index * 0.1
            }}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${line.x}%`,
              width: `${line.length}px`,
              height: '1px',
              backgroundColor: 'rgba(0, 255, 209, 0.2)',
              transform: `rotate(${line.rotation}deg)`
            }}
          />
        ))}
      </div>

      {/* Vertical Cyber Lines on Nav Border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 overflow-hidden pointer-events-none">
        {cyberLines.slice(0, 10).map((line, index) => (
          <motion.div
            key={`vertical-${index}`}
            initial={{ 
              opacity: 0, 
              height: 0,
            }}
            animate={{ 
              opacity: [0, line.opacity, 0],
              height: [0, Math.random() * 100, 0]
            }}
            transition={{
              duration: line.speed * 2,
              repeat: Infinity,
              repeatType: "loop",
              delay: index * 0.2
            }}
            style={{
              position: 'absolute',
              left: 0,
              top: `${Math.random() * 100}%`,
              width: '2px',
              backgroundColor: 'rgba(0, 255, 209, 0.3)',
            }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-6 items-center relative z-10">
        {menuItems.map((item) => (
          <motion.div
            key={item.path}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <button
              onClick={() => handleNavigation(item.path)}
              className={`
                group flex items-center justify-center 
                w-12 h-12 transition-all duration-300 
                relative overflow-hidden border-2
                leading-none
                ${activeItem === item.path
                  ? 'border-secondary text-secondary shadow-[0_0_10px_rgba(255,20,147,0.5)]'
                  : 'border-primary/50 text-primary hover:border-secondary hover:text-secondary'}
                hover:shadow-[0_0_10px_rgba(255,20,147,0.3)]
                rounded-none
              `}
            >
              <div className="relative z-10 flex items-center justify-center w-5 h-5 leading-none">
                {/* Clone icon element adding alignment classes */}
                {React.cloneElement(item.icon, { className: "inline-block align-middle" })}
              </div>

              <AnimatePresence>
                {activeItem === item.path && (
                  <motion.div
                    layoutId="active-indicator"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: '100%',
                      transition: {
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }
                    }}
                    className="absolute bottom-0 left-0 h-[2px] bg-secondary"
                  />
                )}
              </AnimatePresence>
            </button>

            <span className="block text-center font-press-start text-[8px] text-primary/70 mt-1">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </nav>
  );
};

export default NavigationMenu;
