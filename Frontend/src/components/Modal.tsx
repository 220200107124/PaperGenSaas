import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-xl',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={clsx(
                "relative bg-white w-full rounded-[2.5rem] shadow-2xl shadow-gray-900/20 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300",
                sizes[size]
            )}>
                {/* Header */}
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all active:scale-90"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto max-h-[70vh]">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex items-center justify-end gap-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
