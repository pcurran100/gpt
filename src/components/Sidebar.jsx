import React from 'react';
import { FiPlus, FiFolder, FiCalendar, FiClock } from 'react-icons/fi';

const Sidebar = ({ isOpen, setIsOpen }) => {
  // Sample navigation items
  const navItems = [
    { name: 'ChatGPT', icon: <FiPlus /> },
    { name: 'Sora', icon: <FiPlus /> },
    { name: 'Monday', icon: <FiPlus /> },
    { name: 'Ireland Budget 2025', icon: <FiPlus /> },
    { name: 'Explore GPTs', icon: <FiPlus /> },
  ];

  const projects = [
    { name: 'Commercial Energy Storage', icon: <FiFolder /> },
  ];

  const todayItems = [
    { name: 'Color Palette Breakdown', icon: <FiCalendar /> },
    { name: 'Tech Stack for ChatGPT Clone', icon: <FiCalendar /> },
    { name: 'SAS Data Step Basics', icon: <FiCalendar /> },
    { name: 'SAS workspace error 해결', icon: <FiCalendar /> },
  ];

  const previousItems = [
    { name: 'String to number formula', icon: <FiClock /> },
    { name: 'Chrome extension messaging', icon: <FiClock /> },
    { name: 'Firestore User Data Structure', icon: <FiClock /> },
  ];

  if (!isOpen) return null;

  return (
    <div className="w-72 bg-deep-plum text-pure-white flex flex-col h-full overflow-hidden transition-all">
      {/* New Chat Button */}
      <div className="p-3">
        <button className="w-full flex items-center gap-3 rounded-md border border-muted-taupe/30 px-3 py-2 transition-colors hover:bg-muted-taupe/10">
          <FiPlus />
          <span>New chat</span>
        </button>
      </div>

      {/* Navigation Items */}
      <div className="overflow-y-auto flex-1">
        <div className="mb-5">
          {navItems.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 px-3 py-2 hover:bg-muted-taupe/10 cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-warm-beige flex items-center justify-center text-deep-plum">
                {item.icon}
              </div>
              <span>{item.name}</span>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div className="px-3 mb-1">
          <h3 className="text-xs font-medium text-muted-taupe uppercase tracking-wider">Projects</h3>
          {projects.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 px-3 py-2 mt-1 hover:bg-muted-taupe/10 cursor-pointer"
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          ))}
        </div>

        {/* Today Section */}
        <div className="px-3 mb-1 mt-5">
          <h3 className="text-xs font-medium text-muted-taupe uppercase tracking-wider">Today</h3>
          {todayItems.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 px-3 py-2 mt-1 hover:bg-muted-taupe/10 cursor-pointer"
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          ))}
        </div>

        {/* Previous 7 Days */}
        <div className="px-3 mb-1 mt-5">
          <h3 className="text-xs font-medium text-muted-taupe uppercase tracking-wider">Previous 7 Days</h3>
          {previousItems.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 px-3 py-2 mt-1 hover:bg-muted-taupe/10 cursor-pointer"
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* View Plans */}
      <div className="p-3 border-t border-muted-taupe/30">
        <div className="flex items-center gap-3 px-3 py-2 hover:bg-muted-taupe/10 cursor-pointer">
          <div className="w-5 h-5 rounded-full bg-warm-beige flex items-center justify-center text-deep-plum">
            <FiPlus />
          </div>
          <div>
            <div className="text-sm">View plans</div>
            <div className="text-xs text-muted-taupe">Unlimited access, team...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 