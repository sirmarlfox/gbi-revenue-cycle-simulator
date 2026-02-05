export enum ScenarioType {
  A = 'Scenario A: Standard Order (Happy Path)',
  B = 'Scenario B: The Stockout (Production Required)',
  C = 'Scenario C: Supply Chain Crisis (Procurement Required)'
}

export enum ProcessStep {
  SalesOrder = 1,
  Shipping = 2,
  Billing = 3,
  Collections = 4,
  Complete = 5
}

export interface Inventory {
  bikes: number;
  frames: number;
}

export interface SimulationState {
  scenario: ScenarioType;
  step: ProcessStep;
  inventory: Inventory;
}

export const PRODUCT_DATA = {
  vendor: {
    name: 'Global Bike International (GBI)',
    address: '45 Thames Road, Woolwich Industrial Estate, Woolwich, London SE18 5NU',
    city: 'London'
  },
  customer: {
    name: 'Kigali Velo Ltd',
    id: '20050',
    currency: 'GBP',
    address: '78 Avenue du Commerce, Kigali, Rwanda'
  },
  carrier: {
    name: 'Freight Ltd',
    address: '100 Logistics Park, Woolwich, London SE18 5NU'
  },
  bike: {
    sku: 'DXTR1000',
    name: 'Deluxe Touring Bike (Black)',
    price: 3000
  },
  frame: {
    sku: 'TRFR1000',
    name: 'Touring Frame',
    cost: 500
  }
};