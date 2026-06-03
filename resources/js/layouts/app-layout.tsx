import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useState, type ReactNode } from 'react';
import FlashToast from '@/components/toastify';
import axios from 'axios';


interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  recentOrders?: any[];
}

export default ({ children, breadcrumbs, recentOrders, ...props }: AppLayoutProps) => {

  const [recentOrdersState, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {

    const fetchRecentOrders = async () => {

      try {

        const response = await axios.get(
          '/cpanel/dashboard/recent-orders'
        );

        setRecentOrders(
          response.data.recentOrders || []
        );

      } catch (error) {

        console.error(
          'Failed fetch recent orders',
          error
        );
      }
    };

    /*
    |--------------------------------------------------------------------------
    | Initial Fetch
    |--------------------------------------------------------------------------
    */

    fetchRecentOrders();

    /*
    |--------------------------------------------------------------------------
    | Polling
    |--------------------------------------------------------------------------
    */

    const interval = setInterval(
      fetchRecentOrders,
      10000
    );

    /*
    |--------------------------------------------------------------------------
    | Cleanup
    |--------------------------------------------------------------------------
    */

    return () => clearInterval(interval);

  }, []);
  
  return (
    <>
      <FlashToast />
      <AppLayoutTemplate breadcrumbs={breadcrumbs} recentOrders={recentOrdersState || recentOrders} {...props}>
        {children}
      </AppLayoutTemplate>
    </>
  );
}
