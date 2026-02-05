import React from 'react';
import { ScenarioType } from '../types';
import { RefreshCw, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  currentScenario: ScenarioType;
  onScenarioChange: (scenario: ScenarioType) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScenario, onScenarioChange, onReset }) => {
  return (
    <header className="bg-fintech-card border-b border-fintech-border p-4 shadow-lg flex justify-between items-center z-20">
      <div className="flex items-center space-x-3">
        <div className="bg-fintech-primary/20 p-2 rounded-lg">
           <LayoutDashboard className="h-6 w-6 text-fintech-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">GBI Revenue Cycle Simulator</h1>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <label htmlFor="scenario-select" className="text-sm text-fintech-muted font-medium">
            Active Scenario:
          </label>
          <div className="relative">
            <select
              id="scenario-select"
              value={currentScenario}
              onChange={(e) => onScenarioChange(e.target.value as ScenarioType)}
              className="appearance-none bg-fintech-bg text-fintech-text border border-fintech-border hover:border-fintech-primary rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-fintech-primary transition-all cursor-pointer w-80 shadow-sm"
            >
              {Object.values(ScenarioType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-fintech-muted">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center space-x-2 bg-fintech-border hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-all border border-slate-600 hover:border-slate-500 shadow-sm"
          title="Reset Simulation"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
};