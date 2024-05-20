import { useEffect, useState } from 'react';
import {
    Button,
    Group,
    Modal,
    ScrollArea,
    Space,
    Stack,
    Text,
    Code, Paper
} from '@mantine/core';
import axios from 'axios';
import { config } from '../../config/env.config.ts';

interface TaskTreatment {
    ID: string;
    TaskId: string;
    Timestamp: string;
    Result: any;
}

interface TreatmentsModalProps {
    taskId: string;
    opened: boolean;
    onClose: () => void;
}

export function TreatmentsModal({ taskId, opened, onClose }: TreatmentsModalProps) {
    const [treatments, setTreatments] = useState<TaskTreatment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (taskId && opened) {
            axios.get(`${config.apiUrl}/task/${taskId}/treatments`)
                .then((response) => {
                    setTreatments(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching treatments:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [taskId, opened]);

    return (
        <Modal opened={opened} onClose={onClose} title="Task Treatments" size="lg">
            <ScrollArea style={{ height: 400 }}>
                {loading ? (
                    <Text>Loading treatments...</Text>
                ) : treatments.length === 0 ? (
                    <Text>No treatments found for this task.</Text>
                ) : (
                    <Stack>
                        {treatments.map((treatment) => (
                            <Paper key={treatment.ID} shadow="sm" p="md" withBorder>
                                <Text size="sm" fw={500}>
                                    Result of {new Date(treatment.Timestamp).toLocaleString()}
                                </Text>
                                <Space h="xs" />
                                <Code block style={{ whiteSpace: 'pre-wrap' }}>
                                    {JSON.stringify(treatment.Result, null, 2)}
                                </Code>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </ScrollArea>
            <Space h="md" />
            <Group p="right">
                <Button onClick={onClose}>Close</Button>
            </Group>
        </Modal>
    );
}