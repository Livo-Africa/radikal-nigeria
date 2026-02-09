'use client';
import { useEffect } from 'react';
import { usePaystackPayment } from 'react-paystack';

interface PaystackHandlerProps {
    email: string;
    amount: number;
    publicKey: string;
    reference: string;
    currency?: string;
    metadata?: any;
    onSuccess: (reference: any) => void;
    onClose: () => void;
    trigger: boolean;
    setTrigger: (value: boolean) => void;
    phone?: string;
}

export default function PaystackHandler({
    email,
    amount,
    publicKey,
    reference,
    currency = 'GHS',
    metadata,
    onSuccess,
    onClose,
    trigger,
    setTrigger,
    phone
}: PaystackHandlerProps) {
    const config = {
        reference,
        email,
        amount, // Amount should be passed in kobo/pesewas (Base + 2%)
        publicKey,
        currency,
        metadata: metadata || {},
        phone, // Pass phone to Paystack config
    };

    const initializePayment = usePaystackPayment(config);

    useEffect(() => {
        if (trigger) {
            initializePayment({
                onSuccess: (ref: any) => {
                    onSuccess(ref);
                    setTrigger(false);
                },
                onClose: () => {
                    onClose();
                    setTrigger(false);
                }
            });
        }
    }, [trigger, initializePayment, onSuccess, onClose, setTrigger]);

    return null; // This component renders nothing
}
