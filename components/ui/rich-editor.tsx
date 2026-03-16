"use client";

import React from 'react';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';

interface RichEditorProps {
  value: string;
  onChange: (htmlValue: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  readOnly?: boolean;
}

export function RichEditor({ value, onChange, placeholder, style, readOnly = false }: RichEditorProps) {
  // Configuração básica da toolbar do Quill
  const renderHeader = () => {
    return (
      <span className="ql-formats flex flex-wrap gap-1 items-center pb-1">
        <select className="ql-header" defaultValue="0">
          <option value="1">Título 1</option>
          <option value="2">Título 2</option>
          <option value="0">Normal</option>
        </select>
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
        <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
        <button className="ql-list" value="bullet" aria-label="Unordered List"></button>
        <button className="ql-link" aria-label="Insert Link"></button>
        <button className="ql-clean" aria-label="Remove Styles"></button>
      </span>
    );
  };

  const header = renderHeader();

  const handleChange = (e: EditorTextChangeEvent) => {
    // e.htmlValue ou e.textValue
    const html = e.htmlValue || "";
    onChange(html);
  };

  return (
    <div className="w-full rounded-md border border-slate-200 overflow-hidden bg-white">
      <Editor 
        value={value} 
        onTextChange={handleChange} 
        headerTemplate={header} 
        style={{ height: '250px', ...style }} 
        readOnly={readOnly}
        placeholder={placeholder}
      />
      <style jsx global>{`
        .p-editor-container .p-editor-content {
          border-color: #e2e8f0;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
        .p-editor-container .p-editor-toolbar {
          border-color: #e2e8f0;
          background: #f8fafc;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }
        .ql-container {
           font-family: inherit !important;
           font-size: 1rem !important;
        }
      `}</style>
    </div>
  );
}
