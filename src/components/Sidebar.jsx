import React, { useState, useRef } from 'react';
import { FiPlus, FiMessageSquare, FiTrash2, FiEdit2, FiChevronDown, FiChevronRight, FiFolderPlus, FiMoreVertical, FiX } from 'react-icons/fi';
import { useFirestore } from '../contexts/FirestoreContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [isShowingNewFolderInput, setIsShowingNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [editingConversation, setEditingConversation] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [menuOpen, setMenuOpen] = useState(null); // Track which conversation's menu is open
  
  const menuRef = useRef(null);
  
  const { 
    folders, 
    currentFolder, 
    conversations, 
    currentConversation,
    createNewFolder, 
    createNewConversation, 
    selectFolder,
    selectConversation,
    deleteFolder,
    deleteConversation,
    updateConversation
  } = useFirestore();
  
  // Close menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Handle creating a new chat immediately
  const handleCreateNewChat = async () => {
    // Default title for new chat
    const title = 'New chat';
    
    try {
      const conversationRef = await createNewConversation(title);
      // Select the new conversation
      if (conversationRef) {
        selectConversation(conversationRef.id);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };
  
  // Handle creating a new folder
  const handleCreateNewFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    await createNewFolder(newFolderName);
    setNewFolderName('');
    setIsShowingNewFolderInput(false);
  };
  
  // Start editing a conversation name
  const handleEditConversation = (conversation) => {
    setEditingConversation(conversation.id);
    setEditingName(conversation.title);
    setMenuOpen(null);
  };
  
  // Save the edited conversation name
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingName.trim()) return;
    
    try {
      if (currentFolder && editingConversation) {
        await updateConversation(editingConversation, { title: editingName });
        setEditingConversation(null);
        setEditingName('');
      }
    } catch (error) {
      console.error('Error updating conversation name:', error);
    }
  };
  
  // Group conversations by date
  const groupConversationsByDate = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = new Date(today - 86400000).getTime(); // 86400000 = 24 * 60 * 60 * 1000
    const lastWeek = new Date(today - 7 * 86400000).getTime();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).getTime();
    
    const groups = {
      'Today': [],
      'Yesterday': [],
      'Previous 7 Days': [],
      'Previous 30 Days': [],
      'Older': []
    };
    
    conversations.forEach(convo => {
      const date = convo.createdAt ? new Date(convo.createdAt.seconds * 1000) : new Date();
      const timestamp = date.getTime();
      
      if (timestamp >= today) {
        groups['Today'].push(convo);
      } else if (timestamp >= yesterday) {
        groups['Yesterday'].push(convo);
      } else if (timestamp >= lastWeek) {
        groups['Previous 7 Days'].push(convo);
      } else if (timestamp >= lastMonth) {
        groups['Previous 30 Days'].push(convo);
      } else {
        groups['Older'].push(convo);
      }
    });
    
    // Return only non-empty groups
    return Object.entries(groups)
      .filter(([_, convos]) => convos.length > 0)
      .map(([label, conversations]) => ({ label, conversations }));
  };
  
  const conversationGroups = groupConversationsByDate();
  
  // Format the date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  if (!isOpen) return null;
  
  return (
    <aside className="w-64 bg-deep-plum text-pure-white flex flex-col h-screen overflow-y-auto flex-shrink-0">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-soft-gray/20">
        <button 
          onClick={handleCreateNewChat}
          className="w-full flex items-center justify-center gap-2 border border-muted-taupe/30 text-pure-white py-2 px-4 rounded-md hover:bg-muted-taupe/10 transition-colors"
        >
          <FiPlus />
          <span>New chat</span>
        </button>
      </div>
      
      {/* Folders and Conversations */}
      <div className="p-2 flex-1 overflow-y-auto">
        {/* Folders Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between p-2">
            <button 
              onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
              className="flex items-center gap-2 text-muted-taupe font-medium"
            >
              {isProjectsExpanded ? <FiChevronDown /> : <FiChevronRight />}
              <span>Folders</span>
            </button>
            <button 
              onClick={() => setIsShowingNewFolderInput(true)}
              className="p-1 hover:bg-muted-taupe/10 rounded-md text-muted-taupe"
              aria-label="Add folder"
            >
              <FiFolderPlus size={16} />
            </button>
          </div>
          
          {/* New Folder Input */}
          {isShowingNewFolderInput && (
            <form onSubmit={handleCreateNewFolder} className="p-2 flex flex-col gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full p-2 border border-muted-taupe/30 bg-deep-plum text-pure-white rounded-md"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-muted-taupe/20 text-pure-white p-2 rounded-md hover:bg-muted-taupe/30 text-sm"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsShowingNewFolderInput(false)}
                  className="flex-1 border border-muted-taupe/30 p-2 rounded-md text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          
          {/* Folders List */}
          {isProjectsExpanded && (
            <div className="pl-4 space-y-1">
              {folders.map((folder) => (
                <div 
                  key={folder.id}
                  className={`
                    flex items-center justify-between p-2 rounded-md cursor-pointer group
                    ${currentFolder && folder.id === currentFolder.id ? 'bg-muted-taupe/20' : 'hover:bg-muted-taupe/10'}
                  `}
                  onClick={() => selectFolder(folder.id)}
                >
                  <span className="truncate">{folder.name}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFolder(folder.id);
                    }}
                    className="p-1 hover:bg-muted-taupe/20 rounded-md opacity-0 group-hover:opacity-100"
                    aria-label="Delete folder"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Conversations in current folder */}
        {currentFolder && (
          <div>
            <h3 className="px-2 py-1 text-xs font-medium text-muted-taupe uppercase tracking-wider">{currentFolder.name}</h3>
            
            {conversationGroups.map((group) => (
              <div key={group.label} className="mb-4">
                <div className="px-2 py-1 text-xs text-muted-taupe font-medium">
                  {group.label}
                </div>
                <div className="space-y-1">
                  {group.conversations.map((convo) => (
                    <div key={convo.id}>
                      {editingConversation === convo.id ? (
                        // Edit mode
                        <form onSubmit={handleSaveEdit} className="px-2 py-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1 p-1 bg-deep-plum border border-muted-taupe/30 rounded-md text-pure-white"
                            autoFocus
                          />
                          <button 
                            type="submit"
                            className="p-1 hover:bg-muted-taupe/20 rounded-md"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              setEditingConversation(null);
                              setEditingName('');
                            }}
                            className="p-1 hover:bg-muted-taupe/20 rounded-md"
                          >
                            <FiX size={14} />
                          </button>
                        </form>
                      ) : (
                        // Display mode
                        <div 
                          className={`
                            flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer group relative
                            ${currentConversation && convo.id === currentConversation.id ? 'bg-muted-taupe/20' : 'hover:bg-muted-taupe/10'}
                          `}
                          onClick={() => selectConversation(convo.id)}
                        >
                          <FiMessageSquare size={16} className="flex-shrink-0 text-muted-taupe" />
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{convo.title}</div>
                            <div className="text-xs text-muted-taupe">
                              {formatDate(convo.createdAt)}
                            </div>
                          </div>
                          <button 
                            className="p-1 hover:bg-muted-taupe/20 rounded-md opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpen(menuOpen === convo.id ? null : convo.id);
                            }}
                            aria-label="More options"
                          >
                            <FiMoreVertical size={14} />
                          </button>
                          
                          {/* Dropdown menu */}
                          {menuOpen === convo.id && (
                            <div 
                              ref={menuRef}
                              className="absolute right-0 top-full mt-1 w-36 bg-deep-plum border border-muted-taupe/30 shadow-lg rounded-md z-10"
                            >
                              <button 
                                className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-muted-taupe/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditConversation(convo);
                                }}
                              >
                                <FiEdit2 size={14} />
                                <span>Rename</span>
                              </button>
                              <button 
                                className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-muted-taupe/20 text-crimson-red"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteConversation(convo.id);
                                  setMenuOpen(null);
                                }}
                              >
                                <FiTrash2 size={14} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {conversations.length === 0 && (
              <div className="p-2 text-sm text-muted-taupe text-center">
                No conversations yet. Start by creating a new chat.
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 