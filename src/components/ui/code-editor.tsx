'use client';

import React, { useEffect, useRef } from 'react';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { php } from '@codemirror/lang-php';
import { sql } from '@codemirror/lang-sql';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { xml } from '@codemirror/lang-xml';
import { markdown } from '@codemirror/lang-markdown';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const languageExtensions: Record<string, any> = {
  javascript: javascript(),
  js: javascript(),
  typescript: javascript({ typescript: true }),
  ts: javascript({ typescript: true }),
  python: python(),
  py: python(),
  java: java(),
  cpp: cpp(),
  c: cpp(),
  php: php(),
  sql: sql(),
  html: html(),
  css: css(),
  json: json(),
  xml: xml(),
  markdown: markdown(),
  md: markdown(),
  rust: rust(),
  go: go(),
};

export function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  placeholder = '// Enter your code here...',
  disabled = false,
  className = '',
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const languageExtension = languageExtensions[language.toLowerCase()] || javascript();
    
    const state = EditorState.create({
      doc: value || placeholder,
      extensions: [
        basicSetup,
        languageExtension,
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            if (newValue !== placeholder) {
              onChange(newValue);
            }
          }
        }),
        EditorView.theme({
          '&': {
            fontSize: '14px',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          },
          '.cm-editor': {
            height: '140px !important',
            minHeight: '140px !important',
          },
          '.cm-scroller': {
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            height: '140px !important',
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [language]);

  useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
      const transaction = viewRef.current.state.update({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value,
        },
      });
      viewRef.current.dispatch(transaction);
    }
  }, [value]);

  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.dom.style.pointerEvents = disabled ? 'none' : 'auto';
      viewRef.current.dom.style.opacity = disabled ? '0.6' : '1';
    }
  }, [disabled]);

  return (
    <div className={`border-2 border-gray-300 dark:border-gray-600 rounded-md overflow-hidden transition-[border-color] hover:border-blue-400 dark:hover:border-blue-500 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-[3px] focus-within:ring-blue-500/50 ${className}`} style={{ height: '140px' }}>
      <div ref={editorRef} className="w-full h-full" />
    </div>
  );
} 