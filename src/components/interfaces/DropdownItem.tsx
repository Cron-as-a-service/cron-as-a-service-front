import { ReactNode } from 'react';

export interface DropdownItem {
    title: string;
    label?: string;
    onClick: () => void;
    icon: ReactNode;
}