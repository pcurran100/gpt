import React, { useState } from 'react';
import { FiPlus, FiFolder, FiChevronDown, FiChevronRight } from 'react-icons/fi';

const Sidebar = ({ isOpen, setIsOpen, chats, currentChatId, setCurrentChatId, createNewChat, updateChatProject }) => {
  // Sample projects
  const projects = [
    { id: 1, name: 'Commercial Energy Storage', icon: <FiFolder /> },
  ];
  
  // State to track drag operations
  const [draggedChatId, setDraggedChatId] = useState(null);
  
  // State to track collapsed projects
  const [collapsedProjects, setCollapsedProjects] = useState({});
  
  // Toggle project collapse state
  const toggleProjectCollapse = (projectId) => {
    setCollapsedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };
  
  // Function to determine the date category based on actual timestamp
  const getDateCategory = (timestamp) => {
    const now = new Date();
    const chatDate = new Date(timestamp);
    
    // Reset hours to compare just the dates
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const chatDay = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate());
    
    // Check if date is today
    if (chatDay.getTime() === today.getTime()) {
      return 'Today';
    }
    
    // Check if date is yesterday
    if (chatDay.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    }
    
    // Check if within last 7 days
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    if (chatDay >= sevenDaysAgo) {
      return 'Previous 7 Days';
    }
    
    // Check if within last 30 days
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    if (chatDay >= thirtyDaysAgo) {
      return 'Previous 30 Days';
    }
    
    // Otherwise return the month name
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[chatDate.getMonth()];
  };
  
  // Group chats by their date category
  const groupedChats = chats.reduce((acc, chat) => {
    // Skip chats assigned to projects for the time-based categories
    if (chat.projectId) return acc;
    
    const category = getDateCategory(chat.timestamp);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(chat);
    return acc;
  }, {});
  
  // Order of categories to display
  const categoryOrder = [
    'Today', 
    'Yesterday', 
    'Previous 7 Days', 
    'Previous 30 Days', 
    'March', 
    'February', 
    'January',
    'December',
    'November',
    'October',
    'September',
    'August',
    'July',
    'June',
    'May',
    'April'
  ];
  
  // Get chats assigned to each project
  const getProjectChats = (projectId) => {
    return chats.filter(chat => chat.projectId === projectId);
  };
  
  // Drag handlers
  const handleDragStart = (e, chatId) => {
    setDraggedChatId(chatId);
  };
  
  const handleDragOver = (e, projectId) => {
    e.preventDefault(); // Allow drop
  };
  
  const handleDrop = (e, projectId) => {
    e.preventDefault();
    if (draggedChatId) {
      updateChatProject(draggedChatId, projectId);
      setDraggedChatId(null);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="w-72 bg-deep-plum text-pure-white flex flex-col h-full overflow-hidden transition-all">
      {/* New Chat Button */}
      <div className="p-3">
        <button 
          className="w-full flex items-center gap-3 rounded-md border border-muted-taupe/30 px-3 py-2 transition-colors hover:bg-muted-taupe/10"
          onClick={createNewChat}
        >
          <FiPlus />
          <span>New chat</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="overflow-y-auto flex-1">
        {/* Projects Section - Now at the top */}
        <div className="px-3 mb-4">
          <h3 className="text-xs font-medium text-muted-taupe uppercase tracking-wider mb-1">
            Projects
          </h3>
          {projects.map((project) => {
            const projectChats = getProjectChats(project.id);
            const isCollapsed = collapsedProjects[project.id];
            
            return (
              <div key={project.id} className="mb-1">
                <div 
                  className="flex items-center px-3 py-2 hover:bg-muted-taupe/10 cursor-pointer"
                  onDragOver={(e) => handleDragOver(e, project.id)}
                  onDrop={(e) => handleDrop(e, project.id)}
                >
                  <div className="flex items-center gap-3 flex-1" onClick={() => toggleProjectCollapse(project.id)}>
                    {isCollapsed ? <FiChevronRight size={16} /> : <FiChevronDown size={16} />}
                    {project.icon}
                    <span>{project.name}</span>
                  </div>
                </div>
                
                {/* Display chats under this project if not collapsed */}
                {!isCollapsed && projectChats.length > 0 && (
                  <div className="ml-6">
                    {projectChats.map(chat => (
                      <div 
                        key={chat.id} 
                        className={`flex items-center px-3 py-2 hover:bg-muted-taupe/10 cursor-pointer ${
                          chat.id === currentChatId ? 'bg-muted-taupe/20' : ''
                        }`}
                        onClick={() => setCurrentChatId(chat.id)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, chat.id)}
                      >
                        <span className="pl-2">{chat.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Chat List - Organized by date categories */}
        {categoryOrder.map(category => {
          const categoryChats = groupedChats[category] || [];
          if (categoryChats.length === 0) return null;
          
          return (
            <div key={category} className="mb-4">
              <h3 className="px-3 text-xs font-medium text-muted-taupe uppercase tracking-wider mb-1">
                {category}
              </h3>
              
              {/* Sort by timestamp in descending order (newest first) */}
              {categoryChats
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map(chat => (
                  <div 
                    key={chat.id} 
                    className={`flex items-center px-3 py-2 hover:bg-muted-taupe/10 cursor-pointer ${
                      chat.id === currentChatId ? 'bg-muted-taupe/20' : ''
                    }`}
                    onClick={() => setCurrentChatId(chat.id)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, chat.id)}
                  >
                    <span className="pl-2">{chat.title}</span>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar; 