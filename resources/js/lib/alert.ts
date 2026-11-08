import Swal from 'sweetalert2';
import { toast } from 'sonner';

/**
 * Toast notifications powered by Sonner
 */
export const notify = {
    success: (message: string, description?: string) => {
        toast.success(message, {
            description,
            duration: 3500,
        });
    },
    error: (message: string, description?: string) => {
        toast.error(message, {
            description,
            duration: 4000,
        });
    },
    info: (message: string, description?: string) => {
        toast.info(message, {
            description,
            duration: 3500,
        });
    },
};

/**
 * SweetAlert2 dialogs for confirmations and alerts
 */
export const sweetAlert = {
    confirm: async ({
        title = 'Are you sure?',
        text = 'This action cannot be undone.',
        confirmButtonText = 'Yes, proceed',
        cancelButtonText = 'Cancel',
        icon = 'warning' as const,
    }): Promise<boolean> => {
        const result = await Swal.fire({
            title,
            text,
            icon,
            showCancelButton: true,
            confirmButtonColor: '#4f46e5', // indigo-600
            cancelButtonColor: '#64748b', // slate-500
            confirmButtonText,
            cancelButtonText,
            reverseButtons: true,
            customClass: {
                popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-sans shadow-2xl',
                title: 'font-bold text-slate-900 dark:text-white text-lg',
                htmlContainer: 'text-xs text-slate-500 dark:text-slate-400',
                confirmButton:
                    'rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md',
                cancelButton:
                    'rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-sm',
            },
        });

        return result.isConfirmed;
    },

    confirmDelete: async (entityName = 'this item'): Promise<boolean> => {
        const result = await Swal.fire({
            title: `Delete ${entityName}?`,
            text: 'This action is permanent and cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48', // rose-600
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-sans shadow-2xl',
                title: 'font-bold text-slate-900 dark:text-white text-lg',
                htmlContainer: 'text-xs text-slate-500 dark:text-slate-400',
                confirmButton:
                    'rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-500',
                cancelButton:
                    'rounded-xl bg-slate-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm',
            },
        });

        return result.isConfirmed;
    },

    success: (title: string, text?: string) => {
        return Swal.fire({
            title,
            text,
            icon: 'success',
            confirmButtonColor: '#4f46e5',
            confirmButtonText: 'OK',
            customClass: {
                popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-sans shadow-2xl',
                title: 'font-bold text-slate-900 dark:text-white text-lg',
                htmlContainer: 'text-xs text-slate-500 dark:text-slate-400',
                confirmButton:
                    'rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md',
            },
        });
    },

    error: (title: string, text?: string) => {
        return Swal.fire({
            title,
            text,
            icon: 'error',
            confirmButtonColor: '#e11d48',
            confirmButtonText: 'OK',
            customClass: {
                popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-sans shadow-2xl',
                title: 'font-bold text-slate-900 dark:text-white text-lg',
                htmlContainer: 'text-xs text-slate-500 dark:text-slate-400',
                confirmButton:
                    'rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md',
            },
        });
    },
};

