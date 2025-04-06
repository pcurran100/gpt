import React, { useState } from 'react';
import { FiPlus, FiMessageSquare, FiTrash2, FiEdit2, FiChevronDown, FiChevronRight, FiFolderPlus } from 'react-icons/fi';
import { useFirestore } from '../contexts/FirestoreContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [newChatName, setNewChatName] = useState('');
  const [isShowingNewChatInput, setIsShowingNewChatInput] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [isShowingNewFolderInput, setIsShowingNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
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
    deleteConversation 
  } = useFirestore();
  
  // Handle creating a new chat
  const handleCreateNewChat = async (e) => {
    e.preventDefault();
    if (!newChatName.trim()) return;
    
    await createNewConversation(newChatName);
    setNewChatName('');
    setIsShowingNewChatInput(false);
  };
  
  // Handle creating a new folder
  const handleCreateNewFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    await createNewFolder(newFolderName);
    setNewFolderName('');
    setIsShowingNewFolderInput(false);
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
      .map(([label, convos]) => ({ label, conversations: convos }));
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
    <aside className="w-64 bg-soft-gray border-r border-soft-gray h-screen overflow-y-auto flex-shrink-0">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-soft-gray">
        <button 
          onClick={() => setIsShowingNewChatInput(true)}
          className="w-full flex items-center justify-center gap-2 bg-deep-plum text-pure-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
        >
          <FiPlus />
          <span>New chat</span>
        </button>
        
        {/* New Chat Input */}
        {isShowingNewChatInput && (
          <form onSubmit={handleCreateNewChat} className="mt-4 flex flex-col gap-2">
            <input
              type="text"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              placeholder="Chat name"
              className="w-full p-2 border border-soft-gray rounded-md"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-deep-plum text-pure-white p-2 rounded-md hover:bg-opacity-90"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsShowingNewChatInput(false)}
                className="flex-1 bg-soft-gray border border-soft-gray p-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      
      {/* Folders and Conversations */}
      <div className="p-2">
        {/* Folders Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between p-2">
            <button 
              onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
              className="flex items-center gap-2 text-dark-espresso font-medium"
            >
              {isProjectsExpanded ? <FiChevronDown /> : <FiChevronRight />}
              <span>Folders</span>
            </button>
            <button 
              onClick={() => setIsShowingNewFolderInput(true)}
              className="p-1 hover:bg-gray-200 rounded-md"
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
                className="w-full p-2 border border-soft-gray rounded-md"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-deep-plum text-pure-white p-2 rounded-md hover:bg-opacity-90 text-sm"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsShowingNewFolderInput(false)}
                  className="flex-1 bg-soft-gray border border-soft-gray p-2 rounded-md text-sm"
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
                    flex items-center justify-between p-2 rounded-md cursor-pointer
                    ${currentFolder && folder.id === currentFolder.id ? 'bg-gray-300' : 'hover:bg-gray-200'}
                  `}
                  onClick={() => selectFolder(folder.id)}
                >
                  <span className="truncate">{folder.name}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFolder(folder.id);
                    }}
                    className="p-1 hover:bg-gray-300 rounded-md opacity-0 group-hover:opacity-100"
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
            <h3 className="p-2 font-medium">{currentFolder.name}</h3>
            
            {conversationGroups.map((group) => (
              <div key={group.label} className="mb-2">
                <div className="px-2 py-1 text-xs text-muted-taupe font-medium">
                  {group.label}
                </div>
                <div className="space-y-1">
                  {group.conversations.map((convo) => (
                    <div 
                      key={convo.id}
                      className={`
                        flex items-center gap-2 p-2 rounded-md cursor-pointer group
                        ${currentConversation && convo.id === currentConversation.id ? 'bg-gray-300' : 'hover:bg-gray-200'}
                      `}
                      onClick={() => selectConversation(convo.id)}
                    >
                      <FiMessageSquare size={16} className="flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{convo.title}</div>
                        <div className="text-xs text-muted-taupe">
                          {formatDate(convo.createdAt)}
                        </div>
                      </div>
                      <div className="flex items-center opacity-0 group-hover:opacity-100">
                        <button 
                          className="p-1 hover:bg-gray-300 rounded-md"
                          aria-label="Edit conversation"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversation(convo.id);
                          }}
                          className="p-1 hover:bg-gray-300 rounded-md"
                          aria-label="Delete conversation"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
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