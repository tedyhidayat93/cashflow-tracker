<?php

namespace App\Services;

use App\Models\Configuration;
use App\Models\Order;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailService
{
    /**
     * Configure SMTP settings dynamically
     */
    private function configureSMTP(): void
    {
        $config = [
            'transport' => 'smtp',
            'host' => Configuration::getValue('smtp_host'),
            'port' => Configuration::getValue('smtp_port', '587'),
            'encryption' => Configuration::getValue('smtp_encryption', 'tls'),
            'username' => Configuration::getValue('smtp_username'),
            'password' => Configuration::getValue('smtp_password'),
            'from' => [
                'address' => Configuration::getValue('mail_from_address'),
                'name' => Configuration::getValue('mail_from_name', 'Company Profile ASKI'),
            ],
        ];

        config([
            'mail.mailers.smtp' => $config,
            'mail.default' => 'smtp',
        ]);
    }

    /**
     * Send email to owner when order is created
     */
    public function sendOrderNotificationToOwner(Order $order): bool
    {
        try {
            // Check if owner notification is enabled
            $notifyOwner = Configuration::getValue('notify_email_owner_order_created', 'true');
            if ($notifyOwner !== 'true') {
                return false; // Notification disabled
            }

            // Get target email for owner
            $ownerEmail = Configuration::getValue('target_email_address_owner');
            if (!$ownerEmail) {
                Log::warning('Owner email address not configured');
                return false;
            }

            // Configure SMTP
            $this->configureSMTP();

            // Prepare email data
            $emailData = [
                'order' => $order,
                'customerName' => $order->pic_name,
                'companyName' => $order->company_name,
                'productName' => $order->product_name,
                'productSlug' => $order->product?->slug,
                'quantity' => $order->quantity,
                'totalPrice' => number_format($order->total_price, 0, ',', '.'),
                'phone' => $order->phone,
                'email' => $order->email,
                'notes' => $order->notes,
                'orderNumber' => $order->order_number,
                'createdAt' => $order->created_at->format('d M Y H:i'),
            ];

            // Send email
            Mail::send('emails.order-notification-owner', $emailData, function ($message) use ($ownerEmail, $order) {
                $message->to($ownerEmail)
                    ->subject('New Order Received - #' . $order->order_number)
                    ->from(config('mail.from.address'), config('mail.from.name'));
            });

            Log::info('Owner notification sent successfully for order #' . $order->order_number);
            return true;

        } catch (\Exception $e) {
            Log::error('Failed to send owner notification for order #' . $order->order_number . ': ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send email to customer when order is successful
     */
    public function sendOrderConfirmationToCustomer(Order $order): bool
    {
        try {
            // Check if customer notification is enabled
            $notifyCustomer = Configuration::getValue('notify_email_customer_order_success', 'true');
            if ($notifyCustomer !== 'true') {
                return false; // Notification disabled
            }

            // Configure SMTP
            $this->configureSMTP();

            // Prepare email data
            $emailData = [
                'order' => $order,
                'customerName' => $order->pic_name,
                'companyName' => $order->company_name,
                'productName' => $order->product_name,
                'productSlug' => $order->product?->slug,
                'quantity' => $order->quantity,
                // 'showPrice' => $order->product?->show_price ?? true,
                'totalPrice' => number_format($order->total_price, 0, ',', '.'),
                'orderNumber' => $order->order_number,
                'orderNote' => $order->notes,
                'createdAt' => $order->created_at->format('d M Y H:i'),
                'contactEmail' => Configuration::getValue('contact_email'),
                'contactPhone' => Configuration::getValue('contact_phone'),
            ];

            // Send email
            Mail::send('emails.order-confirmation-customer', $emailData, function ($message) use ($order) {
                $message->to($order->email)
                    ->subject('Order Confirmation - #' . $order->order_number)
                    ->from(config('mail.from.address'), config('mail.from.name'));
            });

            Log::info('Customer confirmation sent successfully for order #' . $order->order_number);
            return true;

        } catch (\Exception $e) {
            Log::error('Failed to send customer confirmation for order #' . $order->order_number . ': ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send both owner and customer notifications
     */
    public function sendOrderNotifications(Order $order): array
    {
        $ownerSent = $this->sendOrderNotificationToOwner($order);
        $customerSent = $this->sendOrderConfirmationToCustomer($order);

        return [
            'owner_sent' => $ownerSent,
            'customer_sent' => $customerSent,
        ];
    }
}
