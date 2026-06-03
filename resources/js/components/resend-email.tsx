import { router, usePage } from '@inertiajs/react';
import { Loader2, Mail } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface FlashProps {
    success?: string;
    error?: string;
}

interface ResendOrderEmailDialogProps {
    orderId: number;
    children?: ReactNode;
}

export default function ResendOrderEmailDialog({
    orderId,
    children,
}: ResendOrderEmailDialogProps) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { props } = usePage();

    const flash = (props.flash as FlashProps) || {
        success: '',
        error: '',
    };

    /*
    |--------------------------------------------------------------------------
    | Handle Flash Message
    |--------------------------------------------------------------------------
    */
    useEffect(() => {

        if (flash.success) {
            setOpen(false);
            setLoading(false);
        }

        if (flash.error) {
            setLoading(false);
        }

    }, [flash.success, flash.error]);

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */
    const handleSubmit = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {

        e.preventDefault();

        setLoading(true);

        router.post(
            `/cpanel/crm/orders/${orderId}/resend-email`,
            {},
            {
                preserveScroll: true,

                onError: () => {
                    setLoading(false);
                },

                onFinish: () => {
                    setLoading(false);
                },
            }
        );
    };

    return (

        <AlertDialog
            open={open}
            onOpenChange={setOpen}
        >

            <AlertDialogTrigger asChild>

                {children ?? (

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                    >
                        <Mail className="mr-2 h-4 w-4" />
                        Kirim Ulang Email
                    </Button>

                )}

            </AlertDialogTrigger>

            <AlertDialogContent>

                <AlertDialogHeader>

                    <AlertDialogTitle>
                        Kirim ulang email?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Sistem akan mencoba mengirim ulang email
                        notifikasi kepada customer dan owner.
                    </AlertDialogDescription>

                </AlertDialogHeader>

                <AlertDialogFooter>

                    <AlertDialogCancel disabled={loading}>
                        Batal
                    </AlertDialogCancel>

                    <AlertDialogAction
                        type="button"
                        disabled={loading}
                        onClick={handleSubmit}
                    >

                        {loading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}

                        {loading
                            ? 'Mengirim...'
                            : 'Ya, Kirim Ulang'}

                    </AlertDialogAction>

                </AlertDialogFooter>

            </AlertDialogContent>

        </AlertDialog>
    );
}
