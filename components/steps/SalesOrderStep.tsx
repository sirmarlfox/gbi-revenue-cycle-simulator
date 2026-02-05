import React, { useState } from 'react';
import { ScenarioType, Inventory, PRODUCT_DATA } from '../../types';
import { Document, ActionButton } from '../SharedUI';
import { ClipboardList, AlertTriangle, CheckCircle, Package, Factory, Truck, CreditCard, FileCheck, Box } from 'lucide-react';

interface Props {
  scenario: ScenarioType;
  inventory: Inventory;
  onUpdateInventory: (inv: Inventory) => void;
  onComplete: () => void;
}

type SubStep = 'review-po' | 'credit-check' | 'generate-ack' | 'stock-check' | 'production' | 'procurement' | 'ready-to-approve';

export const SalesOrderStep: React.FC<Props> = ({ scenario, inventory, onUpdateInventory, onComplete }) => {
  const [subStep, setSubStep] = useState<SubStep>('review-po');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleStartProcess = () => {
    setLoading(true);
    addLog("Received PO. Initiating Sales Order process...");
    setTimeout(() => {
      setLoading(false);
      setSubStep('credit-check');
      addLog("Fetching Credit Data...");
    }, 1000);
  };

  const handleCreditDecision = (approved: boolean) => {
    if (!approved) {
      alert("Order Rejected based on Credit Limit.");
      return; 
    }
    setLoading(true);
    addLog("Credit Approved. Generating Order Acknowledgement...");
    setTimeout(() => {
      setLoading(false);
      setSubStep('generate-ack');
    }, 1000);
  };

  const handleProceedToStock = () => {
    setLoading(true);
    addLog("Order Acknowledged. Generating Internal Sales Order...");
    setTimeout(() => {
        setLoading(false);
        setSubStep('stock-check');
        addLog(`Internal SO Generated. Checking Inventory for 50x ${PRODUCT_DATA.bike.sku}...`);
    }, 1000);
  };

  const handleProduction = () => {
    setLoading(true);
    addLog("Generating Production Order for 50 Bikes...");
    setTimeout(() => {
      onUpdateInventory({ ...inventory, bikes: 50 });
      setLoading(false);
      setSubStep('ready-to-approve');
      addLog("Production Complete. Inventory updated to 50.");
    }, 2000);
  };

  const handleProcurement = () => {
    setLoading(true);
    addLog("Generating Purchase Requisition for 50 Frames...");
    setTimeout(() => {
        addLog("Goods Receipt: 50 Frames received from Supplier.");
        onUpdateInventory({ ...inventory, frames: 50 });
        setLoading(false);
        setSubStep('production');
    }, 2000);
  };

  const isStockSufficient = inventory.bikes >= 50;
  const isRawMaterialSufficient = inventory.frames >= 50;

  // Credit Calculation Constants
  const ORDER_VALUE = 150000;
  const CREDIT_LIMIT = 250000;
  const CURRENT_EXPOSURE = 45000;
  const NEW_EXPOSURE = CURRENT_EXPOSURE + ORDER_VALUE;

  return (
    <div className="space-y-8">
      {/* Top Status Bar */}
      <div className="bg-fintech-card p-5 rounded-lg shadow-lg border border-fintech-border flex justify-between items-center sticky top-0 z-10 backdrop-blur-md bg-opacity-95">
        <div>
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
             <span className="w-2 h-2 bg-fintech-primary rounded-full"></span> 
             Task: Sales Order Entry
          </h3>
          <p className="text-sm text-fintech-muted pl-4">Credit Check &rarr; Acknowledgement &rarr; Inventory Sourcing</p>
        </div>
        <div className="text-right text-sm">
           <div className="font-mono text-fintech-muted">Bike Stock: <span className={inventory.bikes >= 50 ? "text-fintech-success font-bold" : "text-red-500 font-bold"}>{inventory.bikes}</span></div>
           <div className="font-mono text-fintech-muted">Frame Stock: <span className={inventory.frames >= 50 ? "text-fintech-success font-bold" : "text-red-500 font-bold"}>{inventory.frames}</span></div>
        </div>
      </div>

      {/* Document Area */}
      <div className="space-y-8 py-4">
        {/* Always show PO initially */}
        <Document title="Customer Purchase Order" subtitle={`PO #998877 - ${PRODUCT_DATA.customer.name}`}>
            <div className="grid grid-cols-2 gap-4 mb-6 text-gray-900">
            <div>
                <span className="block text-gray-600 text-xs">Vendor:</span>
                {PRODUCT_DATA.vendor.name}<br/>
                <span className="text-xs">{PRODUCT_DATA.vendor.address}</span>
            </div>
            <div>
                <span className="block text-gray-600 text-xs">Ship To:</span>
                {PRODUCT_DATA.customer.name}<br/>
                <span className="text-xs">{PRODUCT_DATA.customer.address}</span>
            </div>
            </div>
            <table className="w-full text-left mb-6 border-collapse text-gray-900">
            <thead>
                <tr className="border-b border-gray-400">
                <th className="py-2 text-gray-700">Item</th>
                <th className="py-2 text-gray-700">Description</th>
                <th className="py-2 text-right text-gray-700">Qty</th>
                <th className="py-2 text-right text-gray-700">Unit Price</th>
                <th className="py-2 text-right text-gray-700">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td className="py-2 text-gray-900">10</td>
                <td className="py-2 text-gray-900">
                  <span className="font-semibold text-blue-900">{PRODUCT_DATA.bike.sku}</span> <span className="text-gray-900">{PRODUCT_DATA.bike.name}</span>
                </td>
                <td className="py-2 text-right font-bold text-lg text-black">50</td>
                <td className="py-2 text-right text-gray-900">£{PRODUCT_DATA.bike.price.toLocaleString()}</td>
                <td className="py-2 text-right text-gray-900">£{(50 * PRODUCT_DATA.bike.price).toLocaleString()}</td>
                </tr>
            </tbody>
            </table>
            <div className="text-right font-bold text-lg text-black">
            Total: £150,000.00
            </div>
        </Document>

        {/* Order Acknowledgement appears after credit check and stays */}
        {(subStep === 'generate-ack' || subStep === 'stock-check' || subStep === 'production' || subStep === 'procurement' || subStep === 'ready-to-approve') && (
            <div className="animate-fade-in-up">
              <Document title="Order Acknowledgement" subtitle="Confirmation of Receipt" watermark="CONFIRMED">
                  <p className="mb-4 text-black">Dear {PRODUCT_DATA.customer.name},</p>
                  <p className="mb-4 text-black">We verify that your order PO #998877 has been accepted into our system. Financial clearance has been granted.</p>
                  <div className="bg-gray-100 p-4 font-mono text-sm border border-gray-300 text-black">
                      <div className="flex justify-between">
                          <span>Sales Order ID:</span>
                          <span className="font-bold">SO-100025</span>
                      </div>
                      <div className="flex justify-between">
                          <span>Estimated Ship Date:</span>
                          <span className="font-bold">{new Date(Date.now() + 86400000).toLocaleDateString()}</span>
                      </div>
                  </div>
              </Document>
            </div>
        )}

        {/* Internal Standard Order appears during Stock Check phase */}
        {(subStep === 'stock-check' || subStep === 'production' || subStep === 'procurement' || subStep === 'ready-to-approve') && (
            <div className="animate-fade-in-up">
                <Document title="Standard Order" subtitle="Internal Document: SO-100025" watermark="INTERNAL">
                   <div className="flex justify-between mb-4 text-black text-sm">
                        <div>
                            <strong>Sales Org:</strong> UE00 (UK West)<br/>
                            <strong>Dist Channel:</strong> WH (Wholesale)<br/>
                            <strong>Division:</strong> BI (Bicycles)
                        </div>
                        <div className="text-right">
                             <strong>Sold-To:</strong> {PRODUCT_DATA.customer.id}<br/>
                             <strong>Doc Date:</strong> {new Date().toLocaleDateString()}<br/>
                             <strong>Ref PO:</strong> 998877
                        </div>
                   </div>
                   <table className="w-full text-left mb-6 border-collapse text-black text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border border-gray-300">Itm</th>
                                <th className="p-2 border border-gray-300">Material</th>
                                <th className="p-2 border border-gray-300 text-right">Qty</th>
                                <th className="p-2 border border-gray-300 text-center">Plant</th>
                                <th className="p-2 border border-gray-300 text-right">Net Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2 border border-gray-300">10</td>
                                <td className="p-2 border border-gray-300">
                                    <div className="font-bold">{PRODUCT_DATA.bike.sku}</div>
                                    <div className="text-xs text-gray-700">{PRODUCT_DATA.bike.name}</div>
                                </td>
                                <td className="p-2 border border-gray-300 text-right font-bold">50</td>
                                <td className="p-2 border border-gray-300 text-center">DL00</td>
                                <td className="p-2 border border-gray-300 text-right">£150,000</td>
                            </tr>
                        </tbody>
                   </table>
                   <div className="bg-yellow-50 p-2 border border-yellow-200 text-sm text-black flex justify-between items-center">
                       <div>
                           <strong>Shipping Point:</strong> DL00 (London)<br/>
                           <strong>Incoterms:</strong> FOB (Free on Board)
                       </div>
                       <div className="text-right">
                           <strong>Total Value:</strong><br/>
                           <span className="font-bold text-lg">£150,000.00</span>
                       </div>
                   </div>
                </Document>
            </div>
        )}
      </div>

      {/* Action Area */}
      <div className="bg-fintech-card p-6 rounded-lg border border-fintech-border sticky bottom-0 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
        
        {/* Step 1: Initial PO Review */}
        {subStep === 'review-po' && (
          <div className="flex justify-center">
            <ActionButton onClick={handleStartProcess} loading={loading}>
              <ClipboardList className="w-5 h-5" />
              <span>Initiate Sales Order</span>
            </ActionButton>
          </div>
        )}

        {/* Step 2: Credit Check */}
        {subStep === 'credit-check' && (
            <div className="animate-fade-in">
                <div className="bg-slate-800/50 border border-fintech-border p-6 rounded-lg mb-4">
                    <h4 className="font-bold text-fintech-text flex items-center gap-2 mb-4">
                        <CreditCard className="w-5 h-5 text-fintech-primary" /> Credit Limit Check
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center mb-6">
                        <div className="bg-fintech-bg p-3 rounded border border-fintech-border">
                            <div className="text-xs text-fintech-muted">Credit Limit</div>
                            <div className="font-bold text-lg font-mono text-white">£{CREDIT_LIMIT.toLocaleString()}</div>
                        </div>
                        <div className="bg-fintech-bg p-3 rounded border border-fintech-border">
                            <div className="text-xs text-fintech-muted">Current Exposure</div>
                            <div className="font-bold text-lg font-mono text-white">£{CURRENT_EXPOSURE.toLocaleString()}</div>
                        </div>
                        <div className="bg-fintech-bg p-3 rounded border-2 border-fintech-primary">
                            <div className="text-xs text-fintech-primary font-bold">New Total</div>
                            <div className={`font-bold text-lg font-mono ${NEW_EXPOSURE > CREDIT_LIMIT ? 'text-red-500' : 'text-fintech-success'}`}>
                                £{NEW_EXPOSURE.toLocaleString()}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-center gap-4">
                        <ActionButton variant="danger" onClick={() => handleCreditDecision(false)}>
                            Reject Order
                        </ActionButton>
                        <ActionButton variant="primary" onClick={() => handleCreditDecision(true)}>
                            Accept & Verify Credit
                        </ActionButton>
                    </div>
                </div>
            </div>
        )}

        {/* Step 3: Ack */}
        {subStep === 'generate-ack' && (
            <div className="flex justify-center animate-fade-in">
                <ActionButton variant="success" onClick={handleProceedToStock}>
                    <FileCheck className="w-5 h-5" />
                    <span>Send Acknowledgement & Generate Internal SO</span>
                </ActionButton>
            </div>
        )}

        {/* Step 4: Stock Check Logic */}
        {subStep === 'stock-check' && (
          <div className="animate-fade-in">
             <div className={`border p-6 rounded-lg mb-4 ${isStockSufficient ? 'bg-emerald-900/20 border-emerald-800' : 'bg-red-900/20 border-red-800'}`}>
                    <h4 className={`font-bold flex items-center gap-2 mb-4 ${isStockSufficient ? 'text-emerald-400' : 'text-red-400'}`}>
                        <Box className="w-5 h-5" /> Inventory Availability Check
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center mb-6">
                        <div className="bg-fintech-bg p-3 rounded border border-fintech-border">
                            <div className="text-xs text-fintech-muted">Required Qty</div>
                            <div className="font-bold text-lg font-mono text-white">50</div>
                        </div>
                        <div className="bg-fintech-bg p-3 rounded border border-fintech-border">
                            <div className="text-xs text-fintech-muted">Available Stock</div>
                            <div className={`font-bold text-lg font-mono ${inventory.bikes >= 50 ? 'text-fintech-success' : 'text-red-500'}`}>
                                {inventory.bikes}
                            </div>
                        </div>
                        <div className={`bg-fintech-bg p-3 rounded border-2 ${isStockSufficient ? 'border-fintech-success' : 'border-red-500'}`}>
                            <div className="text-xs text-fintech-muted font-bold">Status</div>
                            <div className={`font-bold text-lg ${isStockSufficient ? 'text-fintech-success' : 'text-red-500'}`}>
                                {isStockSufficient ? 'Available' : 'Shortage'}
                            </div>
                        </div>
                    </div>

                    {!isStockSufficient && (
                        <div className="bg-white p-3 rounded text-sm text-red-800 border border-red-200 shadow-sm mb-2 font-medium">
                            <strong>System Alert:</strong> Insufficient stock to fulfill Order SO-100025. Backorder or Production required.
                        </div>
                    )}
              </div>

             {isStockSufficient ? (
                <div className="flex justify-center mt-4">
                  <ActionButton onClick={onComplete} variant="success">
                    <CheckCircle className="w-5 h-5" />
                    <span>Approve & Send to Shipping</span>
                  </ActionButton>
                </div>
             ) : (
                <div className="flex flex-col items-center mt-4 space-y-4">
                   {isRawMaterialSufficient ? (
                     <div className="text-center w-full">
                       <p className="mb-2 text-sm text-fintech-muted">Raw materials (Frames) are available.</p>
                       <ActionButton onClick={handleProduction} loading={loading} variant="secondary" className="w-full">
                         <Factory className="w-5 h-5" />
                         <span>Initiate Production Run (Convert Frames)</span>
                       </ActionButton>
                     </div>
                   ) : (
                     <div className="text-center w-full">
                        <p className="mb-2 text-sm text-red-400">Raw materials (Frames) also unavailable!</p>
                        <ActionButton onClick={handleProcurement} loading={loading} variant="secondary" className="w-full">
                          <Truck className="w-5 h-5" />
                          <span>Create Purchase Requisition (Buy Frames)</span>
                        </ActionButton>
                     </div>
                   )}
                </div>
             )}
          </div>
        )}

        {/* Intermediate Step: Ready after production */}
        {subStep === 'production' && (
             <div className="animate-fade-in text-center">
                <div className="bg-amber-900/20 border border-amber-700 p-4 rounded-lg mb-4 text-left flex items-start gap-3">
                    <Package className="text-amber-500 shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-amber-500">Raw Materials Arrived</h4>
                        <p className="text-sm text-amber-100">Frames are now in stock ({inventory.frames}). Ready for assembly.</p>
                    </div>
                </div>
                <ActionButton onClick={handleProduction} loading={loading} variant="secondary" className="w-full">
                    <Factory className="w-5 h-5" />
                    <span>Initiate Production Run</span>
                </ActionButton>
             </div>
        )}

        {subStep === 'ready-to-approve' && (
           <div className="animate-fade-in text-center">
              <div className="bg-indigo-900/20 border border-indigo-700 p-4 rounded-lg mb-4 text-left">
                  <h4 className="font-bold text-indigo-400">Production Complete</h4>
                  <p className="text-sm text-indigo-200">Finished goods ({inventory.bikes}) moved to inventory.</p>
              </div>
              <ActionButton onClick={onComplete} variant="success">
                  <CheckCircle className="w-5 h-5" />
                  <span>Approve & Send to Shipping</span>
              </ActionButton>
           </div>
        )}

      </div>

      {/* System Logs */}
      <div className="bg-black border-t-2 border-green-800 text-green-500 font-mono text-xs p-4 rounded-b shadow-inner h-36 overflow-y-auto">
        <div className="opacity-50 border-b border-green-900 pb-1 mb-2 flex justify-between">
            <span>TERMINAL LOG</span>
            <span>STATUS: ONLINE</span>
        </div>
        {logs.length === 0 && <span className="opacity-50 animate-pulse">_Waiting for user action...</span>}
        {logs.map((log, i) => (
          <div key={i} className="mb-1 border-l-2 border-green-900 pl-2 hover:bg-green-900/10">
              <span className="opacity-50 text-[10px] mr-2">[{new Date().toLocaleTimeString()}]</span>
              > {log}
          </div>
        ))}
        <div className="h-4 w-2 bg-green-500 animate-pulse mt-1 inline-block"></div>
      </div>
    </div>
  );
};