import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProcessMap } from './components/ProcessMap';
import { SalesOrderStep } from './components/steps/SalesOrderStep';
import { ShippingStep } from './components/steps/ShippingStep';
import { BillingStep } from './components/steps/BillingStep';
import { CollectionsStep } from './components/steps/CollectionsStep';
import { SummaryModal } from './components/SummaryModal';
import { ScenarioType, ProcessStep, Inventory } from './types';
import { LayoutDashboard } from 'lucide-react';

const INITIAL_INVENTORY_MAP: Record<ScenarioType, Inventory> = {
  [ScenarioType.A]: { bikes: 100, frames: 100 },
  [ScenarioType.B]: { bikes: 0, frames: 100 },
  [ScenarioType.C]: { bikes: 0, frames: 0 },
};

export default function App() {
  const [scenario, setScenario] = useState<ScenarioType>(ScenarioType.A);
  const [step, setStep] = useState<ProcessStep>(ProcessStep.SalesOrder);
  const [inventory, setInventory] = useState<Inventory>(INITIAL_INVENTORY_MAP[ScenarioType.A]);
  const [showSummary, setShowSummary] = useState(false);

  // Reset inventory when scenario changes
  useEffect(() => {
    setInventory(INITIAL_INVENTORY_MAP[scenario]);
    setStep(ProcessStep.SalesOrder);
    setShowSummary(false);
  }, [scenario]);

  const handleReset = () => {
    setInventory(INITIAL_INVENTORY_MAP[scenario]);
    setStep(ProcessStep.SalesOrder);
    setShowSummary(false);
  };

  const handleNextStep = () => {
    if (step === ProcessStep.Collections) {
      setStep(ProcessStep.Complete);
      setShowSummary(true);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case ProcessStep.SalesOrder:
        return (
          <SalesOrderStep
            scenario={scenario}
            inventory={inventory}
            onUpdateInventory={setInventory}
            onComplete={handleNextStep}
          />
        );
      case ProcessStep.Shipping:
        return <ShippingStep onComplete={handleNextStep} />;
      case ProcessStep.Billing:
        return <BillingStep onComplete={handleNextStep} />;
      case ProcessStep.Collections:
        return <CollectionsStep onComplete={handleNextStep} />;
      case ProcessStep.Complete:
        return (
          <div className="flex flex-col items-center justify-center h-full text-fintech-text">
            <LayoutDashboard size={64} className="mb-4 text-fintech-success" />
            <h2 className="text-3xl font-bold tracking-tight">Simulation Complete</h2>
            <p className="mt-2 text-fintech-muted">Review the financial summary or reset to try a different scenario.</p>
            <button
              onClick={() => setShowSummary(true)}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-fintech-primary to-fintech-accent text-white rounded-lg shadow-glow hover:shadow-lg transition font-medium"
            >
              View Summary
            </button>
          </div>
        );
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-fintech-bg text-fintech-text font-sans">
      <Header
        currentScenario={scenario}
        onScenarioChange={setScenario}
        onReset={handleReset}
      />
      
      <main className="flex flex-1 overflow-hidden">
        {/* Left Panel: Process Map */}
        <aside className="w-1/3 bg-fintech-bg border-r border-fintech-border shadow-2xl z-10 overflow-y-auto">
          <ProcessMap currentStep={step} />
        </aside>

        {/* Right Panel: Workspace */}
        <section className="w-2/3 bg-fintech-bg relative overflow-hidden flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fintech-card to-fintech-bg">
           <div className="flex-1 overflow-y-auto p-8 doc-scroll">
              <div className="max-w-4xl mx-auto pb-12">
                {renderStepContent()}
              </div>
           </div>
        </section>
      </main>

      {showSummary && (
        <SummaryModal onClose={() => setShowSummary(false)} onReset={handleReset} />
      )}
    </div>
  );
}