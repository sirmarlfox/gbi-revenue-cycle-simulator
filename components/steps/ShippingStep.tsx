import React, { useState } from 'react';
import { Document, ActionButton } from '../SharedUI';
import { Package, Truck, Check, ClipboardCheck, AlertCircle } from 'lucide-react';
import { PRODUCT_DATA } from '../../types';

interface Props {
  onComplete: () => void;
}

export const ShippingStep: React.FC<Props> = ({ onComplete }) => {
  const [status, setStatus] = useState<'input-pick' | 'picking-complete' | 'packing-start' | 'shipped'>('input-pick');
  const [pickedQty, setPickedQty] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmPick = () => {
    setError(null);
    // Robust check for number input
    const qty = parseInt(pickedQty, 10);
    
    if (isNaN(qty)) {
        setError("Please enter the quantity picked.");
        return;
    }

    if (qty !== 50) {
        setError(`Incorrect quantity: ${qty}. Required: 50.`);
        return;
    }

    setLoading(true);
    setTimeout(() => {
      setStatus('picking-complete');
      setLoading(false);
    }, 1000);
  };

  const handleStartPacking = () => {
      setStatus('packing-start');
  }

  const handleConfirmPacked = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus('shipped');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20">
       <div className="bg-fintech-card p-5 rounded-lg shadow-lg border border-fintech-border">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-fintech-primary rounded-full"></span> 
            Task: Fulfillment
        </h3>
        <p className="text-sm text-fintech-muted pl-4">Pick items, Confirm Packing, Schedule Carrier.</p>
      </div>

      {/* Picking Phase Documents */}
      {(status === 'input-pick' || status === 'picking-complete') && (
        <Document title="Picking Ticket" subtitle="Internal Use Only">
           <div className="border border-dashed border-gray-400 p-4 bg-gray-50 font-mono text-sm text-black">
             <div className="flex justify-between mb-4">
               <span>Bin: A-42-01</span>
               <span>Ref: SO-100025</span>
             </div>
             <table className="w-full">
               <thead className="border-b border-gray-400 text-left bg-gray-100">
                 <tr>
                    <th className="py-2 pl-2 text-black">Item</th>
                    <th className="py-2 text-black">Material / Description</th>
                    <th className="py-2 text-right pr-2 text-black">Qty to Pick</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td className="py-2 pl-2 align-top text-black">10</td>
                   <td className="py-2 align-top">
                       <div className="font-bold text-black">{PRODUCT_DATA.bike.sku}</div>
                       <div className="text-gray-800 text-xs">{PRODUCT_DATA.bike.name}</div>
                   </td>
                   <td className="py-2 text-right pr-2 align-top">
                       <div className="font-bold text-lg text-black">50</div>
                       <div className="text-xs text-gray-700">EA</div>
                   </td>
                 </tr>
               </tbody>
             </table>
             <div className="mt-4 pt-2 border-t border-dashed border-gray-300 flex justify-between items-center">
                 <div>
                    <span className="font-bold">Status: </span>
                    {status === 'picking-complete' ? (
                       <span className="text-green-800 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">FULLY PICKED</span>
                    ) : (
                       <span className="text-red-800 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">OPEN</span>
                    )}
                 </div>
                 {status === 'picking-complete' && (
                     <div className="text-green-800 text-xs flex items-center gap-1">
                         <Check className="w-3 h-3" /> 50/50 Verified
                     </div>
                 )}
             </div>
           </div>
        </Document>
      )}

      {/* Packing/Shipping Phase Documents */}
      {(status === 'packing-start' || status === 'shipped') && (
        <div className="grid md:grid-cols-2 gap-4 animate-fade-in-up">
           <Document title="Packing Slip" subtitle="Includes Customer Copy">
              <div className="text-xs mb-4 text-black">
                  <strong>From:</strong> {PRODUCT_DATA.vendor.address}
              </div>
              <ul className="list-disc pl-5 text-sm text-black">
                 <li>50x {PRODUCT_DATA.bike.name}</li>
                 <li>Accessories Kit x50</li>
                 <li>Warranty Card x50</li>
              </ul>
              <div className="mt-4 border-t pt-2 font-bold text-black">Total Weight: 750kg</div>
           </Document>
           
           <Document title="Bill of Lading" subtitle={`Carrier: ${PRODUCT_DATA.carrier.name}`}>
              <div className="text-xs space-y-2 text-black">
                 <div><span className="font-bold">Carrier Address:</span> {PRODUCT_DATA.carrier.address}</div>
                 <div className="my-2 border-b border-gray-300"></div>
                 <div><span className="font-bold">Freight Class:</span> 92.5</div>
                 <div><span className="font-bold">Terms:</span> FOB Shipping Point</div>
                 <div><span className="font-bold">Tracking:</span> 1Z9992839283</div>
                 <div className="border p-2 mt-4 text-center border-black">
                    DRIVER SIGNATURE REQUIRED
                 </div>
              </div>
           </Document>
        </div>
      )}

      {/* Actions */}
      <div className="bg-fintech-card p-6 rounded-lg border border-fintech-border sticky bottom-0 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
        
        {/* Picking Input */}
        {status === 'input-pick' && (
          <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center space-x-3">
                  <label className="font-bold text-fintech-text text-lg">Enter Qty Picked:</label>
                  <input 
                    type="number" 
                    className="border border-fintech-border rounded p-3 w-32 text-center font-mono text-2xl text-white bg-slate-800 focus:ring-2 focus:ring-fintech-primary focus:outline-none"
                    value={pickedQty}
                    onChange={(e) => {
                         setPickedQty(e.target.value);
                         if (error) setError(null);
                    }}
                    placeholder="50"
                  />
              </div>
              {error && (
                  <div className="text-red-400 text-sm font-bold flex items-center gap-1 animate-pulse bg-red-900/20 px-4 py-2 rounded">
                      <AlertCircle className="w-4 h-4" /> {error}
                  </div>
              )}
              <div className="text-sm text-fintech-muted">
                  (Check "Picking Ticket" for required quantity)
              </div>
              <ActionButton onClick={handleConfirmPick} loading={loading}>
                <Package className="w-5 h-5" />
                <span>Confirm Picking</span>
              </ActionButton>
          </div>
        )}

        {status === 'picking-complete' && (
             <div className="flex flex-col items-center">
                 <div className="text-fintech-success mb-6 flex items-center gap-2 font-bold text-lg">
                     <Check className="w-6 h-6" /> Picking Complete
                 </div>
                 <ActionButton onClick={handleStartPacking} variant="primary">
                     <ClipboardCheck className="w-5 h-5" />
                     <span>Proceed to Packing</span>
                 </ActionButton>
             </div>
        )}

        {status === 'packing-start' && (
          <div className="flex flex-col items-center">
             <p className="mb-6 text-fintech-muted text-center">Goods are staged. Verify contents and seal.</p>
             <ActionButton onClick={handleConfirmPacked} loading={loading}>
                <Truck className="w-5 h-5" />
                <span>Confirm Order Fully Packed & Ship</span>
             </ActionButton>
          </div>
        )}

        {status === 'shipped' && (
          <div className="flex flex-col items-center animate-fade-in">
             <div className="text-fintech-success font-bold text-xl mb-6 flex items-center gap-2">
                <Check className="w-8 h-8" /> Goods Issued & Shipped
             </div>
             <ActionButton onClick={onComplete} variant="success">
                <span>Proceed to Billing</span>
             </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
};