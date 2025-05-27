import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CirclePower, Code, UserRound, Folder } from 'lucide-react';
import { motion } from 'framer-motion';

interface MenuItem {
  label: string;
  path: string;
  icon: JSX.Element;
}

const NavigationMenu = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>(window.location.pathname);

  const menuItems: MenuItem[] = [
    { 
      label: 'Home', 
      path: '/', 
      icon: <CirclePower className="w-5 h-5" /> 
    },
    { 
      label: 'Skills', 
      path: '/skills', 
      icon: <Code className="w-5 h-5" /> 
    },
    { 
      label: 'Projects', 
      path: '/projects', 
      icon: <Folder className="w-5 h-5" /> 
    },
    { 
      label: 'About', 
      path: '/about', 
      icon: <UserRound className="w-5 h-5" /> 
    },
  ];

  const handleNavigation = (path: string) => {
    setActiveItem(path);
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 h-screen w-20 bg-[#0B0C10] border-r border-primary/30 flex flex-col items-center py-8 z-[9999] overflow-hidden">
      <div className="flex flex-col gap-8 items-center relative z-10">
        {menuItems.map((item) => (
          <motion.div
            key={item.path}
            whileHover={{ 
              scale: 1.1,
              rotate: Math.random() * 2 - 1,
            }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <button
              onClick={() => handleNavigation(item.path)}
              className={`group flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-300 relative overflow-hidden 
                ${activeItem === item.path
                  ? 'text-secondary shadow-neon-secondary'
                  : 'text-primary hover:text-secondary hover:shadow-neon-secondary'}
                before:absolute before:inset-0 before:bg-primary/10 before:opacity-0 hover:before:opacity-20 
                before:transition-opacity before:duration-300`}
            >
              {/* Pixel Glitch Effect */}
              <div className="relative">
                {item.icon}
                <div className="absolute inset-0 bg-primary/20 mix-blend-color-dodge opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              </div>
              
              <span className="font-press-start text-[8px] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.label}
              </span>
              
              {activeItem === item.path && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-1 h-8 bg-secondary rounded-l"
                  initial={false}
                  animate={{
                    boxShadow: [
                      '0 0 5px #FF1493',
                      '0 0 10px #FF1493',
                      '0 0 15px #FF1493',
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Bottom Cyberpunk Accent */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-secondary/50 to-primary/20" />
    </nav>
  );
};

export default NavigationMenu;
