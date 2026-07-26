import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'model';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 p-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-200">
          <Bot className="h-5 w-5 text-slate-600" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-5 py-3 text-sm",
          isUser 
            ? "bg-amber-100 text-amber-900 rounded-tr-sm" 
            : "bg-white border border-slate-200 shadow-sm rounded-tl-sm text-slate-700 prose prose-sm prose-slate"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <ReactMarkdown
            components={{
              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
}
