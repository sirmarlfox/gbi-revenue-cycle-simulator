import React, { useState } from 'react';
import { Document, ActionButton, TAccount } from '../SharedUI';
import { FileText, ArrowRight, Check, XCircle } from 'lucide-react';
import { PRODUCT_DATA } from '../../types';

interface Props {
  onComplete: () => void;
}

export const BillingStep: React.FC<Props> = ({ onComplete }) => {
  const [shipmentAccepted, setShipmentAccepted] = useState<boolean | null>(null);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [posted, setPosted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerateInvoice = () => {
    setLoading(true);
    setTimeout(() => {
      setInvoiceGenerated(true);
      setLoading(false);
    }, 1500);
  };

  const handlePost = () => {
    setLoading(true);
    setTimeout(() => {
      setPosted(true);
      setLoading(false);
    }, 1500);
  };

  if (shipmentAccepted === false) {
      return (
          <div className="flex flex-col items-center justify-center h-64">
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-red-500">Process Halted</h3>
              <p className="text-fintech-muted">Customer refused shipment. Billing cannot proceed.</p>
              <button onClick={() => setShipmentAccepted(null)} className="mt-4 text-fintech-primary hover:text-white underline">Try Again</button>
          </div>
      )
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-fintech-card p-5 rounded-lg shadow-lg border border-fintech-border">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-fintech-primary rounded-full"></span> 
            Task: Invoicing
        </h3>
        <p className="text-sm text-fintech-muted pl-4">Verify acceptance, generate invoice based on SO/Delivery, Post to Ledger.</p>
      </div>

      {/* Step 1: Shipment Acceptance */}
      {shipmentAccepted === null && (
          <div className="bg-amber-900/20 border border-amber-700 p-8 rounded-lg text-center max-w-xl mx-auto shadow-lg">
              <h4 className="text-lg font-bold text-amber-500 mb-4">Confirmation Required</h4>
              <p className="mb-6 text-fintech-text">Has the customer acknowledged receipt and accepted the shipment?</p>
              <div className="flex justify-center gap-4">
                  <ActionButton variant="danger" onClick={() => setShipmentAccepted(false)}>No, Refused</ActionButton>
                  <ActionButton variant="success" onClick={() => setShipmentAccepted(true)}>Yes, Accepted</ActionButton>
              </div>
          </div>
      )}

      {/* Step 2: Document Match & Generation */}
      {shipmentAccepted === true && (
          <div className="space-y-8">
              {/* Document Grid - Side by Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Compact Sales Order View */}
                    <div className="bg-white p-4 border border-gray-300 shadow text-xs text-black rounded-sm relative">
                        <div className="font-bold border-b border-gray-300 mb-2">Ref: Sales Order (SO-100025)</div>
                        <div>Item: 50x {PRODUCT_DATA.bike.name}</div>
                        <div>Price: £3,000/ea</div>
                        <div>Total: £150,000</div>
                    </div>
                    {/* Compact Packing Slip View */}
                    <div className="bg-white p-4 border border-gray-300 shadow text-xs text-black rounded-sm relative">
                         <div className="font-bold border-b border-gray-300 mb-2">Ref: Packing Slip</div>
                         <div>Qty Shipped: 50</div>
                         <div>Weight: 750kg</div>
                         <div>Verified: Yes</div>
                    </div>
              </div>

              {!invoiceGenerated ? (
                <div className="text-center py-8 border-y border-fintech-border bg-fintech-card/30">
                    <p className="text-fintech-text mb-6 font-medium">Documents matched. Ready to bill {PRODUCT_DATA.customer.name}.</p>
                    <ActionButton onClick={handleGenerateInvoice} loading={loading}>
                    <FileText className="w-5 h-5" />
                    <span>Generate Invoice #505</span>
                    </ActionButton>
                </div>
              ) : (
                <div className="animate-fade-in space-y-8">
                    {/* The Invoice */}
                    <Document title="Commercial Invoice" subtitle="Invoice #505" footer="Thank you for your business. Terms Net 30.">
                    <div className="flex justify-between mb-6 text-sm text-black">
                        <div>
                            <strong>Bill To:</strong><br/>
                            {PRODUCT_DATA.customer.name}<br/>
                            {PRODUCT_DATA.customer.address}
                        </div>
                        <div className="text-right">
                            <strong>Date:</strong> {new Date().toLocaleDateString()}<br/>
                            <strong>Due Date:</strong> {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}
                        </div>
                    </div>
                    <table className="w-full text-left mb-6 text-black">
                        <thead>
                        <tr className="border-b-2 border-black">
                            <th>Description</th>
                            <th className="text-right">Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="py-2">50x {PRODUCT_DATA.bike.name}</td>
                            <td className="py-2 text-right">£150,000.00</td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="flex justify-end text-xl font-bold border-t border-black pt-2 text-black">
                        Total Due: £150,000.00
                    </div>
                    </Document>

                    <div className="flex flex-col items-center bg-fintech-card p-6 rounded-lg border border-fintech-border shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
                    {!posted ? (
                        <div className="flex items-center gap-4">
                            <p className="font-medium text-fintech-text">Invoice created. Post financial impact to Ledger?</p>
                            <ActionButton onClick={handlePost} loading={loading} variant="primary">
                            <span>Post to Accounts Receivable</span>
                            </ActionButton>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center animate-fade-in-up">
                            <div className="flex gap-8 mb-6">
                            <TAccount 
                                title="Accounts Receivable" 
                                debit={[{ label: 'Inv #505', amount: 150000 }]} 
                                credit={[]} 
                                />
                            <TAccount 
                                title="Sales Revenue" 
                                debit={[]} 
                                credit={[{ label: 'Inv #505', amount: 150000 }]} 
                                />
                            </div>
                            <div className="text-fintech-success font-bold flex items-center gap-2 mb-4 text-lg">
                            <Check className="w-6 h-6" /> Accounting Document 900001 Posted
                            </div>
                            <ActionButton onClick={onComplete} variant="success">
                            Next: Receive Payment <ArrowRight className="w-4 h-4" />
                            </ActionButton>
                        </div>
                    )}
                    </div>
                </div>
              )}
          </div>
      )}
    </div>
  );
};