import React, { useState } from 'react';
import { Document, ActionButton, TAccount } from '../SharedUI';
import { PoundSterling, CheckCircle, XCircle } from 'lucide-react';
import { PRODUCT_DATA } from '../../types';

interface Props {
  onComplete: () => void;
}

export const CollectionsStep: React.FC<Props> = ({ onComplete }) => {
  const [invoiceAccepted, setInvoiceAccepted] = useState<boolean | null>(null);
  const [cleared, setCleared] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeposit = () => {
    setLoading(true);
    setTimeout(() => {
      setCleared(true);
      setLoading(false);
    }, 2000);
  };

  if (invoiceAccepted === false) {
    return (
        <div className="flex flex-col items-center justify-center h-64">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-red-500">Dispute Raised</h3>
            <p className="text-fintech-muted">Customer rejected the invoice. Collection halted.</p>
            <button onClick={() => setInvoiceAccepted(null)} className="mt-4 text-fintech-primary hover:text-white underline">Try Again</button>
        </div>
    )
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-fintech-card p-5 rounded-lg shadow-lg border border-fintech-border">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-fintech-primary rounded-full"></span> 
            Task: Cash Application
        </h3>
        <p className="text-sm text-fintech-muted pl-4">Confirm invoice acceptance, receive wire transfer, clear open items.</p>
      </div>

       {/* Step 1: Invoice Acceptance */}
       {invoiceAccepted === null && (
          <div className="bg-amber-900/20 border border-amber-700 p-8 rounded-lg text-center max-w-xl mx-auto shadow-lg">
              <h4 className="text-lg font-bold text-amber-500 mb-4">Confirmation Required</h4>
              <p className="mb-6 text-fintech-text">Has the customer accepted the invoice?</p>
              <div className="flex justify-center gap-4">
                  <ActionButton variant="danger" onClick={() => setInvoiceAccepted(false)}>No, Dispute</ActionButton>
                  <ActionButton variant="success" onClick={() => setInvoiceAccepted(true)}>Yes, Accepted</ActionButton>
              </div>
          </div>
      )}

      {invoiceAccepted === true && (
          <div className="animate-fade-in space-y-8">
            <div className="bg-fintech-card p-8 rounded-lg border border-fintech-border mx-auto max-w-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fintech-primary to-fintech-accent"></div>
                
                {/* Remittance Advice Document */}
                <div className="bg-white p-6 border border-gray-300 shadow-doc font-mono text-sm mb-8 text-black">
                    <div className="border-b border-gray-300 pb-2 mb-4 flex justify-between">
                        <span className="font-bold text-lg">REMITTANCE ADVICE</span>
                        <span>Date: {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <div>
                            <strong>Payer:</strong><br/>
                            {PRODUCT_DATA.customer.name}<br/>
                            {PRODUCT_DATA.customer.address}
                        </div>
                        <div className="text-right">
                             <strong>Payee:</strong><br/>
                             {PRODUCT_DATA.vendor.name}
                        </div>
                    </div>
                    <table className="w-full text-left mb-4 text-black">
                        <thead className="bg-gray-100 text-black">
                            <tr><th>Invoice #</th><th>Date</th><th>Amount</th><th>Discount</th><th>Net Pay</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-1">505</td>
                                <td className="py-1">{new Date().toLocaleDateString()}</td>
                                <td className="py-1">£150,000</td>
                                <td className="py-1">£0.00</td>
                                <td className="py-1 font-bold">£150,000</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="border-t border-gray-300 pt-2 text-xs text-gray-800">
                        Method: Electronic Wire Transfer (Ref: TRN-88776655)
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <h4 className="font-bold text-white mb-2 text-lg">Funds Available</h4>
                    <p className="text-sm text-fintech-muted mb-6">Bank notification received. Ref: TRN-88776655.</p>
                    {!cleared && (
                    <ActionButton onClick={handleDeposit} loading={loading} className="w-full max-w-xs">
                        <PoundSterling className="w-4 h-4" />
                        <span>Confirm Transfer & Clear</span>
                    </ActionButton>
                    )}
                </div>
            </div>

            {cleared && (
                <div className="animate-fade-in-up">
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <TAccount 
                            title="Bank Account (Cash)" 
                            debit={[{ label: 'Transfer', amount: 150000 }]} 
                            credit={[]} 
                        />
                        <TAccount 
                            title="Accounts Receivable" 
                            debit={[{ label: 'Inv #505', amount: 150000 }]} 
                            credit={[{ label: 'Transfer', amount: 150000 }]} 
                        />
                    </div>
                    
                    <div className="flex justify-center">
                    <ActionButton onClick={onComplete} variant="success" className="px-8 py-4 text-lg">
                        <CheckCircle className="w-6 h-6" />
                        <span>Finish Simulation</span>
                    </ActionButton>
                    </div>
                </div>
            )}
          </div>
      )}
    </div>
  );
};