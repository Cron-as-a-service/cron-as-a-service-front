import { Checkbox, Stack } from '@mantine/core';
import { Attribute } from '../../services/api/targetUrlAnalyser.service.ts';

interface CheckboxListProps {
    attributes: Attribute[];
    onChange: (selectedAttributes: string[]) => void;
}

export function CheckboxList({ attributes, onChange }: CheckboxListProps) {
    const handleCheckboxChange = (attribute: Attribute, checked: boolean) => {
        const updatedAttributes = attributes.map((a) =>
            a.label === attribute.label ? { ...a, checked } : a
        );
        const selectedAttributes = updatedAttributes
            .filter((a) => a.checked)
            .map((a) => a.label);
        onChange(selectedAttributes);
    };

    const handleSelectAllChange = (checked: boolean) => {
        const updatedAttributes = attributes.map((a) => ({ ...a, checked }));
        const selectedAttributes = updatedAttributes
            .filter((a) => a.checked)
            .map((a) => a.label);
        onChange(selectedAttributes);
    };

    const isSelectAllChecked = attributes.every((a) => a.checked) && attributes.length > 0;

    return (
        <Stack>
            <Checkbox
                label="Select all"
                checked={isSelectAllChecked}
                onChange={(event) => handleSelectAllChange(event.currentTarget.checked)}
            />
                {attributes.map((attribute) => (
                    <Checkbox
                        ml={33}
                        key={attribute.key}
                        label={attribute.label}
                        checked={attribute.checked}
                        onChange={(event) => handleCheckboxChange(attribute, event.currentTarget.checked)}
                    />
                ))}
        </Stack>
    );
}
