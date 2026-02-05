import React from 'react';
import { ActionButton } from './SharedUI';
import { Check, ArrowRight } from 'lucide-react';

interface Props {
  onClose: () => void;
  onReset: () => void;
}

export const SummaryModal: React.FC<Props> = ({ onClose, onReset }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-fintech-card border border-fintech-border rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="bg-fintech-bg p-6 border-b border-fintech-border">
          <h2 className="text-2xl font-bold text-white tracking-tight">Simulation Summary</h2>
          <p className="text-fintech-primary text-sm font-medium">Revenue Cycle Analysis</p>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="p-5 bg-fintech-bg rounded-lg border border-fintech-border shadow-inner">
              <div className="text-xs text-fintech-muted uppercase tracking-wider font-bold mb-1">Total Revenue</div>
              <div className="text-2xl font-mono font-bold text-fintech-success">£150,000</div>
            </div>
            <div className="p-5 bg-fintech-bg rounded-lg border border-fintech-border shadow-inner">
              <div className="text-xs text-fintech-muted uppercase tracking-wider font-bold mb-1">COGS</div>
              <div className="text-2xl font-mono font-bold text-red-400">£75,000</div>
              <div className="text-xs text-fintech-muted mt-1">Est. 50% Margin</div>
            </div>
            <div className="p-5 bg-fintech-bg rounded-lg border border-fintech-primary shadow-glow">
              <div className="text-xs text-fintech-primary uppercase tracking-wider font-bold mb-1">Net Profit</div>
              <div className="text-2xl font-mono font-bold text-white">£75,000</div>
            </div>
          </div>

          <div className="space-y-4 border-t border-fintech-border pt-6">
             <h3 className="font-bold text-lg text-white">Key Learning Outcomes:</h3>
             <ul className="space-y-3">
                <li className="flex items-start gap-3">
                   <div className="bg-green-900/30 p-1 rounded-full">
                       <Check className="text-fintech-success w-4 h-4" />
                   </div>
                   <span className="text-fintech-text text-sm leading-relaxed">Understanding integration between Sales, Logistics, and Accounting.</span>
                </li>
                <li className="flex items-start gap-3">
                   <div className="bg-green-900/30 p-1 rounded-full">
                       <Check className="text-fintech-success w-4 h-4" />
                   </div>
                   <span className="text-fintech-text text-sm leading-relaxed">Visualizing the flow of documents (PO &rarr; SO &rarr; Delivery &rarr; Invoice).</span>
                </li>
                <li className="flex items-start gap-3">
                   <div className="bg-green-900/30 p-1 rounded-full">
                       <Check className="text-fintech-success w-4 h-4" />
                   </div>
                   <span className="text-fintech-text text-sm leading-relaxed">Recognizing financial impact via T-Account entries (Dr A/R, Cr Sales).</span>
                </li>
             </ul>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-fintech-border">
            <ActionButton variant="secondary" onClick={onClose}>
               Close Summary
            </ActionButton>
            <ActionButton variant="primary" onClick={onReset}>
               Start New Simulation <ArrowRight className="w-4 h-4" />
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
};