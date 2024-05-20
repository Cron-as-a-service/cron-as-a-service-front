import { Radio, Text, UnstyledButton } from '@mantine/core';
import classes from './CheckboxCard.module.css';

interface RadioCardProps {
    label: string;
    description: string;
    name: string;
    onClick?: () => void;
}

export function RadioCard({ label, description, name, onClick }: RadioCardProps) {
    return (
        <UnstyledButton onClick={onClick} className={classes.button}>
            <Radio
                value={name}
                tabIndex={-1}
                size="md"
                mr="xl"
            />
            <div>
                <Text fw={500} mb={7} lh={1}>
                    {label}
                </Text>
                <Text fz="sm" c="dimmed">
                    {description}
                </Text>
            </div>
        </UnstyledButton>
    );
}
