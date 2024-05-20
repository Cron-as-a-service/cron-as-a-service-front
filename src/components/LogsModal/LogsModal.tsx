import { useEffect, useState } from 'react';
import {
    Badge,
    Button,
    Group,
    Modal,
    ScrollArea,
    Space,
    Stack,
    Text,
    Paper
} from '@mantine/core';
import axios from 'axios';
import { config } from '../../config/env.config.ts';

interface Log {
    TaskId: string;
    Status: string;
    Timestamp: string;
    Message: string;
}

interface LogsModalProps {
    taskId: string;
    opened: boolean;
    onClose: () => void;
}

export function LogsModal({ taskId, opened, onClose }: LogsModalProps) {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (taskId && opened) {
            axios.get(`${config.apiUrl}/task/${taskId}/logs`)
                .then((response) => {
                    setLogs(response.data.reverse());
                })
                .catch((error) => {
                    console.error('Error fetching logs:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [taskId, opened]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'UPDATED':
                return 'orange';
            case 'CREATED':
            case 'OK':
                return 'green';
            case 'ERROR':
                return 'red';
            default:
                return 'gray';
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Task Logs" size="lg">
            <ScrollArea style={{ height: 400 }}>
                {loading ? (
                    <Text>Loading logs...</Text>
                ) : (
                    <Stack>
                        {logs.map((log) => (
                            <Paper key={log.Timestamp} shadow="sm" p="md" withBorder>
                                <Group>
                                    <Badge color={getStatusColor(log.Status)}>{log.Status}</Badge>
                                    <Text size="xs" c="dimmed">
                                        {new Date(log.Timestamp).toLocaleString()}
                                    </Text>
                                </Group>
                                <Space h="xs" />
                                <Text size="sm">{log.Message}</Text>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </ScrollArea>
            <Space h="md" />
            <Group>
                <Button onClick={onClose}>Close</Button>
            </Group>
        </Modal>
    );
}
