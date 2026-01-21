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
}

export default function PaystackHandler({
    email,
    amount,
    publicKey,
    reference,
    currency = 'NGN',
    metadata,
    onSuccess,
    onClose,
    trigger,
    setTrigger
}: PaystackHandlerProps) {
    const config = {
        reference,
        email,
        amount,
        publicKey,
        currency,
        metadata: metadata || {},
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
