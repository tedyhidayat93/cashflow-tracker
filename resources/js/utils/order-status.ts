export const orderStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-purple-100 text-purple-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
} as const;

export const orderStatusLabels = {
  pending: 'Pesanan Baru',
  confirmed: 'Dikonfirmasi',
  processing: 'Diproses',
  shipped: 'Dikirim',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
} as const;

export type OrderStatus = keyof typeof orderStatusColors;

export const getOrderStatusColor = (status: string): string => {
  return orderStatusColors[status as OrderStatus] || 'bg-gray-100 text-gray-800';
};

export const getOrderStatusLabel = (status: string): string => {
  return orderStatusLabels[status as OrderStatus] || status;
};

export const getOrderStatusBadgeProps = (status: string) => {
  return {
    color: getOrderStatusColor(status),
    label: getOrderStatusLabel(status),
  };
};

import React from 'react';
import { Badge } from '@/components/ui/badge';

export const OrderStatusBadge = ({ status }: { status: string }) => {
  const badgeProps = getOrderStatusBadgeProps(status);
  return React.createElement(
    Badge,
    { className: badgeProps.color },
    badgeProps.label
  );
};
