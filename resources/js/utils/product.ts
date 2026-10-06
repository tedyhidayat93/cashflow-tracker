interface ProductSellingStatus {
  is_for_sell: boolean;
  is_rent: boolean;
}

/**
 * Get the display text for product availability type
 * @param product - Product object with is_for_sell and is_rent properties
 * @returns String indicating if product is for sale, rent, or both
 */
export function getProductTypeText(product: ProductSellingStatus): string {
  if (product.is_for_sell && product.is_rent) {
    return 'Dijual & Disewakan';
  } else if (product.is_for_sell) {
    return 'Dijual';
  } else if (product.is_rent) {
    return 'Disewakan';
  }
  return 'Disewakan';
}

// Product utility functions

export interface ContainerSpec {
  label: string;
  value: string;
  note: string;
}

export const getContainerSpecs = (templateType: string): ContainerSpec[] => {
  const baseSpecs: ContainerSpec[] = [
    { label: 'Height (cm)', value: '', note: '' },
    { label: 'Width (cm)', value: '', note: '' },
    { label: 'Length (cm)', value: '', note: '' },
    { label: 'Color', value: '', note: '' }
  ];

  const standardSpecs: ContainerSpec[] = [
    ...baseSpecs,
    { label: 'Cube Capacity', value: '', note: '' },
    { label: 'Max Gross Weight (kg)', value: '', note: '' },
    { label: 'Tare Weight (kg)', value: '', note: '' },
    { label: 'Maximum Payload (kg)', value: '', note: '' },
    { label: 'Inside Cubic Capacity', value: '', note: '' },
    { label: 'Racking Test Load', value: '', note: '' }
  ];

  const reeferSpecs: ContainerSpec[] = [
    ...baseSpecs,
    { label: 'Capacity', value: '', note: '' },
    { label: 'Max Gross Weight (kg)', value: '', note: '' },
    { label: 'Tare Weight (kg)', value: '', note: '' }
  ];

  const tankSpecs: ContainerSpec[] = [
    ...baseSpecs,
    { label: 'Capacity', value: '', note: '' },
    { label: 'Max Gross Weight (kg)', value: '', note: '' },
    { label: 'Tare Weight (kg)', value: '', note: '' }
  ];
  
  switch (templateType) {
    case 'standar-container':
    case 'open-top':
    case 'flat-rack':
      return standardSpecs;
    case 'reefer':
      return reeferSpecs;
    case 'tank-container':
      return tankSpecs;
    case 'custom-container':
      return baseSpecs;
    default:
      return standardSpecs;
  }
};
