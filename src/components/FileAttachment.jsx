import React from 'react';
import { FiDownload, FiFile, FiFileText, FiImage, FiPaperclip } from 'react-icons/fi';

/**
 * FileAttachment component for displaying file attachments in messages
 * 
 * @param {Object} props
 * @param {Object} props.file - File object with metadata
 * @param {Function} props.onRemove - Optional callback for removing the file (used in file selection preview)
 * @param {boolean} props.isPreview - Whether this is a preview in the file selection UI
 */
const FileAttachment = ({ file, onRemove, isPreview = false }) => {
  // Determine file type for icon selection
  const getFileIcon = () => {
    if (!file.contentType) return <FiPaperclip />;
    
    if (file.contentType.startsWith('image/')) {
      return <FiImage />;
    } else if (file.contentType === 'application/pdf') {
      return <FiFile />;
    } else if (
      file.contentType === 'text/plain' || 
      file.contentType.includes('document') ||
      file.contentType.includes('text')
    ) {
      return <FiFileText />;
    } else {
      return <FiPaperclip />;
    }
  };
  
  // Format file size
  const formatFileSize = (size) => {
    if (!size) return '';
    
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${Math.round(size / 1024)} KB`;
    } else {
      return `${Math.round(size / 1024 / 1024 * 10) / 10} MB`;
    }
  };
  
  // Determine if this is an image that should be displayed
  const isDisplayableImage = file.contentType && file.contentType.startsWith('image/') && !isPreview;
  
  if (isDisplayableImage) {
    return (
      <div className="relative rounded-md overflow-hidden border border-gray-200">
        <img 
          src={file.downloadUrl} 
          alt={file.fileName} 
          className="max-w-full h-auto max-h-96 object-contain bg-gray-50"
        />
        <a 
          href={file.downloadUrl} 
          download={file.fileName}
          className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiDownload size={18} />
        </a>
      </div>
    );
  }
  
  // Render standard file attachment
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-200 rounded-md">
          {getFileIcon()}
        </div>
        <div>
          <p className="font-medium truncate max-w-xs">{file.fileName}</p>
          <p className="text-sm text-gray-500">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>
      
      {isPreview && onRemove ? (
        <button 
          onClick={onRemove} 
          className="ml-2 p-2 hover:bg-gray-200 rounded-full"
          aria-label="Remove file"
        >
          <span className="sr-only">Remove</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ) : (
        <a 
          href={file.downloadUrl} 
          download={file.fileName}
          className="ml-2 p-2 hover:bg-gray-200 rounded-full"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiDownload size={18} />
        </a>
      )}
    </div>
  );
};

export default FileAttachment; 