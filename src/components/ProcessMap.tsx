import React from 'react';
import { ProcessStep } from '../types';
import { ShoppingCart, Truck, FileText, PoundSterling, CheckCircle } from 'lucide-react';

interface ProcessMapProps {
  currentStep: ProcessStep;
}

export const ProcessMap: React.FC<ProcessMapProps> = ({ currentStep }) => {
  const steps = [
    {
      id: ProcessStep.SalesOrder,
      label: '1.0 Sales Order Entry',
      icon: ShoppingCart,
      description: 'Receive PO, Check Inventory, Create SO'
    },
    {
      id: ProcessStep.Shipping,
      label: '2.0 Shipping',
      icon: Truck,
      description: 'Pick, Pack, & Ship Goods'
    },
    {
      id: ProcessStep.Billing,
      label: '3.0 Billing',
      icon: FileText,
      description: 'Generate Invoice & Post to A/R'
    },
    {
      id: ProcessStep.Collections,
      label: '4.0 Collections',
      icon: PoundSterling,
      description: 'Receive Payment & Clear Account'
    }
  ];

  return (
    <div className="p-8 h-full flex flex-col bg-fintech-bg relative">
      <h2 className="text-fintech-text font-bold text-xl mb-10 tracking-wide border-b border-fintech-border pb-4 opacity-90">
        Process Flow
      </h2>
      
      <div className="flex-1 flex flex-col justify-center space-y-12 relative">
        {/* Connecting Wire Background */}
        <div className="absolute left-[34px] top-10 bottom-10 w-0.5 bg-fintech-border -z-10"></div>

        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          // Styling logic
          let iconContainerClass = 'bg-fintech-card border-fintech-border text-fintech-muted';
          let textClass = 'text-fintech-muted';
          let descClass = 'text-slate-600';
          let containerClass = 'opacity-60 grayscale';

          if (isActive) {
            iconContainerClass = 'bg-fintech-card border-fintech-primary text-fintech-primary shadow-glow ring-2 ring-fintech-primary/30';
            textClass = 'text-white';
            descClass = 'text-fintech-primary';
            containerClass = 'scale-105 opacity-100';
          }
          if (isCompleted) {
            iconContainerClass = 'bg-fintech-card border-fintech-success text-fintech-success';
            textClass = 'text-fintech-success';
            descClass = 'text-slate-500';
            containerClass = 'opacity-80';
          }

          const Icon = isCompleted ? CheckCircle : step.icon;

          return (
            <div key={step.id} className={`flex items-start transition-all duration-500 ease-in-out ${containerClass}`}>
              <div
                className={`flex-shrink-0 w-18 h-18 p-4 rounded-xl border-2 flex items-center justify-center z-10 transition-all duration-300 ${iconContainerClass}`}
              >
                <Icon size={28} />
              </div>
              <div className="ml-6 pt-1">
                <h3 className={`font-bold text-lg tracking-tight ${textClass}`}>
                  {step.label}
                </h3>
                <p className={`text-sm mt-1 font-medium ${descClass}`}>
                  {step.description}
                </p>
                {isActive && (
                    <div className="mt-2 text-xs font-bold uppercase tracking-widest text-fintech-primary animate-pulse flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-fintech-primary"></span> Processing
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};