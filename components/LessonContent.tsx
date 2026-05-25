'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';
import QuizBlock from '@/components/QuizBlock';

// Import CSS highlight.js — bright light theme
import 'highlight.js/styles/github.css';

interface LessonContentProps {
  content?: string;
  markdown?: string;
}

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative group/code my-6 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 font-mono text-sm shadow-sm">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-100/80 text-xs text-gray-500">
        <span className="font-bold tracking-wider text-blue-600 uppercase">{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 hover:text-gray-900 transition py-0.5 px-2 rounded hover:bg-gray-200"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-600 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-semibold">Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code Area */}
      <pre className="p-4 overflow-x-auto leading-relaxed scrollbar-thin text-gray-800">
        <code className={`hljs language-${language}`}>{value}</code>
      </pre>
    </div>
  );
}

export default function LessonContent({ content, markdown }: LessonContentProps) {
  const rawContent = content || markdown || '';
  
  const quizSeparator = '\n## Quiz\n';
  const parts = rawContent.split(quizSeparator);
  const lessonContent = parts[0];
  const quizContent = parts[1] || null;

  return (
    <div className="lesson-content select-text">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom styling for elements to fit bright Coursera theme
          h1: ({ children }) => (
            <h1 className="text-3xl font-extrabold text-gray-900 mt-8 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3 pb-2 border-b border-gray-200">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-700 leading-relaxed mb-4 text-base">{children}</p>
          ),
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && match) {
              return (
                <CodeBlock
                  language={match[1]}
                  value={codeString}
                  {...props}
                />
              );
            }

            return (
              <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono font-semibold" {...props}>
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-gray-200 text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-200 bg-gray-50 px-4 py-2.5 text-left font-bold text-gray-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-200 px-4 py-2 text-gray-700 font-medium">{children}</td>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 mb-4 text-gray-700">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 mb-4 text-gray-700">{children}</ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-1.5 my-4 bg-blue-50/50 text-gray-700 italic rounded-r-lg">
              {children}
            </blockquote>
          ),
        }}
      >
        {lessonContent}
      </ReactMarkdown>

      {quizContent && <QuizBlock markdown={quizContent} />}
    </div>
  );
}
