import { randomId } from '@mantine/hooks';
import { config } from '../../config/env.config.ts';

export interface Attribute {
    label: string;
    checked: boolean;
    key: string;
}

const initialValues = (attributes: string[]): Attribute[] => {
    return attributes.map((attribute) => ({
        label: attribute,
        checked: false,
        key: randomId(),
    }));
};

export async function getTargetUrlAttributes(url: string, method: string): Promise<Attribute[]> {
    const response = await fetch(`${config.apiUrl}/fetching/attributes?url=${encodeURIComponent(url)}&method=${method}`);
    const data = await response.json();
    return initialValues(data.attributes);
}