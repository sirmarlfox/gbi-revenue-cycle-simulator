import React from 'react';

// --- Document Component ---
interface DocumentProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: string;
  watermark?: string;
}

export const Document: React.FC<DocumentProps> = ({ title, subtitle, children, footer, watermark }) => {
  return (
    <div className="bg-[#F8FAFC] border border-gray-300 shadow-doc rounded-sm p-8 mx-auto max-w-2xl relative overflow-hidden transition-all duration-500 animate-fade-in-up text-black transform hover:scale-[1.005]">
      {watermark && (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
          <span className="text-8xl font-bold transform -rotate-45 text-slate-900 font-sans">{watermark}</span>
        </div>
      )}
      
      <div className="border-b-2 border-gray-900 pb-4 mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold font-sans text-gray-900 uppercase tracking-widest">{title}</h2>
          {subtitle && <p className="text-sm font-mono text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className="text-right text-xs font-mono text-gray-500">
          <p>Global Bike International</p>
          <p>London, UK</p>
        </div>
      </div>

      <div className="font-mono text-sm leading-relaxed text-gray-800">
        {children}
      </div>

      {footer && (
        <div className="mt-8 pt-4 border-t border-gray-300 text-center">
          <p className="font-sans italic text-gray-500 text-sm">{footer}</p>
        </div>
      )}
    </div>
  );
};

// --- Action Button Component ---
interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  loading?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  children, 
  variant = 'primary', 
  loading,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyle = "px-6 py-3 rounded-md shadow-lg font-medium tracking-wide transition-all duration-200 flex items-center justify-center space-x-2 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-fintech-bg";
  
  const variants = {
    primary: "bg-gradient-to-r from-fintech-primary to-fintech-accent text-white hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-fintech-card text-fintech-text border border-fintech-border hover:bg-fintech-border disabled:opacity-50",
    danger: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-red-500/50 disabled:opacity-50",
    success: "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-emerald-500/50 disabled:opacity-50"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </>
      ) : children}
    </button>
  );
};

// --- T-Account Component ---
interface TAccountProps {
  title: string;
  debit: { label: string; amount: number }[];
  credit: { label: string; amount: number }[];
}

export const TAccount: React.FC<TAccountProps> = ({ title, debit, credit }) => {
  return (
    <div className="bg-white text-black border border-gray-300 shadow-doc p-4 w-64 mx-auto animate-fade-in font-mono text-sm rounded-sm">
      <h3 className="text-center font-bold border-b-2 border-black pb-1 mb-2 uppercase tracking-tight">{title}</h3>
      <div className="flex">
        <div className="w-1/2 border-r border-black min-h-[100px] px-2">
          <p className="text-[10px] text-gray-500 text-center mb-2 italic uppercase">Debit</p>
          {debit.map((entry, idx) => (
            <div key={idx} className="flex justify-between mb-1">
              <span>{entry.label}</span>
              <span className="font-bold">{entry.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="w-1/2 min-h-[100px] px-2">
          <p className="text-[10px] text-gray-500 text-center mb-2 italic uppercase">Credit</p>
          {credit.map((entry, idx) => (
            <div key={idx} className="flex justify-between mb-1">
              <span>{entry.label}</span>
              <span className="font-bold">{entry.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};