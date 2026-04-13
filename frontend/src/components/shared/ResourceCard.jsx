import React from 'react';
import { Download, FileText, BookOpen, File, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResourceCard({ resource, onDownload, downloaded = false }) {
  const resourceIcons = {
    'pdf': FileText,
    'ebook': BookOpen,
    'template': File,
    'checklist': File
  };

  const resourceColors = {
    'pdf': 'bg-red-500/20 text-red-300',
    'ebook': 'bg-blue-500/20 text-blue-300',
    'template': 'bg-green-500/20 text-green-300',
    'checklist': 'bg-yellow-500/20 text-yellow-300'
  };

  const Icon = resourceIcons[resource.type] || File;

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-xl p-6 hover:bg-surface-container transition-all border border-white/10 hover:border-primary/30"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${resourceColors[resource.type]} p-3 rounded-lg`}>
          <Icon size={20} />
        </div>
        {downloaded && (
          <CheckCircle className="text-green-400" size={20} />
        )}
      </div>

      <h3 className="text-lg font-semibold text-on-surface mb-2">
        {resource.title}
      </h3>

      <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">
        {resource.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-on-surface-variant">Type</span>
          <span className="text-on-surface capitalize">{resource.type}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-on-surface-variant">Size</span>
          <span className="text-on-surface">{formatFileSize(resource.file_size)}</span>
        </div>

        {resource.page_count && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">Pages</span>
            <span className="text-on-surface">{resource.page_count}</span>
          </div>
        )}
      </div>

      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-surface-container text-on-surface-variant rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={() => onDownload(resource)}
        className={`w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
          downloaded
            ? 'bg-green-500/20 text-green-300'
            : 'bg-primary text-on-primary hover:bg-primary/90'
        }`}
      >
        <Download size={16} className="inline mr-2" />
        {downloaded ? 'Downloaded' : 'Download'}
      </button>
    </motion.div>
  );
}
