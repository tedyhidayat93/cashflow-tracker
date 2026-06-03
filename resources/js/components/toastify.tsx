import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { usePage } from '@inertiajs/react';
import 'react-toastify/dist/ReactToastify.css';

interface FlashProps {
  success?: string;
  error?: string;
}

export default function FlashToast() {

  const { props } = usePage();

  const flash = (props.flash as FlashProps) || {};

  useEffect(() => {

    if (flash.success) {

      toast.success(
        flash.success,
        {
          toastId: `success-${flash.success}`,
        }
      );
    }

    if (flash.error) {

      toast.error(
        flash.error,
        {
          toastId: `error-${flash.error}`,
        }
      );
    }

  }, [flash]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={5500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
    />
  );
}