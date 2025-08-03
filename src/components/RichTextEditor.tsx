import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  className = ""
}) => {
  const quillRef = useRef<ReactQuill>(null);

  // Custom toolbar configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      <style jsx global>{`
        .rich-text-editor .ql-editor {
          min-height: 300px;
          font-size: 16px;
          line-height: 1.6;
          color: hsl(var(--foreground));
          background-color: hsl(var(--background));
        }
        
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid hsl(var(--border));
          border-left: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border));
          background-color: hsl(var(--muted));
        }
        
        .rich-text-editor .ql-container {
          border-bottom: 1px solid hsl(var(--border));
          border-left: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border));
          background-color: hsl(var(--background));
        }
        
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: hsl(var(--foreground));
        }
        
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: hsl(var(--foreground));
        }
        
        .rich-text-editor .ql-toolbar button:hover {
          background-color: hsl(var(--accent));
        }
        
        .rich-text-editor .ql-toolbar button.ql-active {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: italic;
        }
        
        .rich-text-editor .ql-editor h1,
        .rich-text-editor .ql-editor h2,
        .rich-text-editor .ql-editor h3,
        .rich-text-editor .ql-editor h4,
        .rich-text-editor .ql-editor h5,
        .rich-text-editor .ql-editor h6 {
          color: hsl(var(--foreground));
          font-weight: 600;
          margin: 1em 0 0.5em 0;
        }
        
        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid hsl(var(--primary));
          padding-left: 16px;
          margin: 16px 0;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }
        
        .rich-text-editor .ql-editor code {
          background-color: hsl(var(--muted));
          padding: 2px 4px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }
        
        .rich-text-editor .ql-editor pre {
          background-color: hsl(var(--muted));
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 16px 0;
        }
        
        .rich-text-editor .ql-editor a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }
        
        .rich-text-editor .ql-editor a:hover {
          color: hsl(var(--primary));
          opacity: 0.8;
        }
      `}</style>
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
