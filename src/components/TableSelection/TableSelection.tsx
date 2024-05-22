import cx from 'clsx';
import { useEffect, useState } from 'react';
import {
    ActionIcon,
    Badge,
    Checkbox,
    Group,
    rem,
    ScrollArea,
    Space,
    Table,
    Text,
    useMantineTheme
} from '@mantine/core';
import classes from './TableSelection.module.css';
import { ButtonMenu } from '../ButtonMenu/ButtonMenu.tsx';
import { DropdownItem } from '../interfaces/DropdownItem.tsx';
import {
    IconCheck,
    IconClockRecord,
    IconCode,
    IconEdit,
    IconFileText,
    IconPlayerPlay,
    IconTrash,
    IconX
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { CreateCronModal } from '../CreateCronModal/CreateCronModal.tsx';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { EditCronModal } from '../EditCronModal/EditCronModal.tsx';
import { Task, TaskDto } from '../../models/task.model.ts';
import { notifications } from '@mantine/notifications';
import { LogsModal } from '../LogsModal/LogsModal.tsx';
import { TreatmentsModal } from '../TreatmentsModal/TreatmentsModal.tsx';
import { config } from '../../config/env.config.ts';

export function TableSelection() {
    const [data, setData] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
    const [opened, { open, close }] = useDisclosure(false);
    const [selection, setSelection] = useState<string[]>([]);
    const [logsTaskId, setLogsTaskId] = useState<string | null>(null);
    const [logsOpened, { open: openLogs, close: closeLogs }] = useDisclosure(false);
    const [treatmentsTaskId, setTreatmentsTaskId] = useState<string | null>(null);
    const [treatmentsOpened, { open: openTreatments, close: closeTreatments }] = useDisclosure(false);

    const { user } = useAuth0();

    useEffect(() => {
        if (user) {
            axios.get(`${config.apiUrl}/task/user/${user.sub}`)
                .then((response) => {
                    const tasks = response.data.map((item: TaskDto) => ({
                        id: item.Id,
                        name: item.Name,
                        cron: item.Cron,
                        function: item.FunctionType,
                        userId: item.UserId,
                        httpMethod: item.HttpMethod,
                        targetUrl: item.TargetUrl,
                        filters: item.Filters,
                        objectId: item.ObjectId,
                        differential: item.Differential,
                        createdAt: item.CreatedAt,
                        updatedAt: item.UpdatedAt,
                    }));
                    setData(tasks);
                })
                .catch((error) => {
                    notifications.show({
                        color: 'red',
                        title: 'Impossible to get Cron tasks',
                        message: `Something went wrong, ${error.message}`,
                        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: 6000,
                    });
                });
        }
    }, [user, editOpened, opened]);

    const handleEdit = (task: Task) => {
        setSelectedTask(task);
        openEdit();
    };

    const handleViewLogs = (taskId: string) => {
        setLogsTaskId(taskId);
        openLogs();
    };

    const handleViewTreatments = (taskId: string) => {
        setTreatmentsTaskId(taskId);
        openTreatments();
    };

    const handleDelete = (id: string) => {
        axios.delete(`${config.apiUrl}/task/${id}`)
            .then(() => {
                notifications.show({
                    color: 'teal',
                    title: 'Cron was deleted',
                    message: 'Everything is fine',
                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 8000,
                });
                setData((currentData) => currentData.filter((task) => task.id !== id));
            })
            .catch((error) => {
                notifications.show({
                    color: 'red',
                    title: 'Cron wasn\'t delete',
                    message: `Something went wrong, ${error.message}`,
                    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 6000,
                });
            });
    };

    const handleRunTask = (id: string) => {
        axios.get(`${config.apiUrl}/task/${id}/run`)
            .then(() => {
                notifications.show({
                    color: 'teal',
                    title: 'Cron was executed',
                    message: 'Task has been run successfully',
                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 8000,
                });
            })
            .catch((error) => {
                notifications.show({
                    color: 'red',
                    title: 'Cron wasn\'t executed',
                    message: `Something went wrong, ${error.message}`,
                    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 6000,
                });
            });
    };

    const theme = useMantineTheme();
    const creationButtons: DropdownItem[] = [
        {
            title: 'cron',
            icon: <IconClockRecord
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.blue[6]}
                stroke={1.5}
            />,
            onClick: () => {
                open();
            }
        }
    ]

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    const toggleAll = () =>
        setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

    const rows = data.map((item: Task) => {
        const selected = selection.includes(item.id);
        return (
            <Table.Tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    <Checkbox checked={selection.includes(item.id)} onChange={() => toggleRow(item.id)} />
                </Table.Td>
                <Table.Td>
                    <Group gap="sm">
                        <Text size="sm" fw={500}>
                            {item.name}
                        </Text>
                    </Group>
                </Table.Td>
                <Table.Td>{item.cron}</Table.Td>
                <Table.Td><Badge color="cyan">{item.function}</Badge></Table.Td>
                <Table.Td>
                    <div style={{ display: 'flex' }}>
                        <ActionIcon variant="filled" aria-label="Edit" onClick={() => handleEdit(item)}>
                            <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                        <Space w="sm" />
                        <ActionIcon variant="filled" color="blue" aria-label="Logs" onClick={() => handleViewLogs(item.id)}>
                            <IconFileText style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                        {item.function == 'differential' && <><Space w="sm"/><ActionIcon variant="filled" color="green"
                                                                                         aria-label="Treatments"
                                                                                         onClick={() => handleViewTreatments(item.id)}>
                            <IconCode style={{width: '70%', height: '70%'}} stroke={1.5}/>
                        </ActionIcon></>}
                        <Space w="sm" />
                        <ActionIcon variant="filled" color="teal" aria-label="Run" onClick={() => handleRunTask(item.id)}>
                            <IconPlayerPlay style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                        <Space w="sm" />
                        <ActionIcon variant="filled" color="red" aria-label="Delete" onClick={() => handleDelete(item.id)}>
                            <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    </div>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <ScrollArea className={cx('crontable')}>
            <CreateCronModal opened={opened} onClose={close} />
            {selectedTask && <EditCronModal task={selectedTask} opened={editOpened} onClose={closeEdit} />}
            {logsTaskId && <LogsModal taskId={logsTaskId} opened={logsOpened} onClose={closeLogs} />}
            {treatmentsTaskId && <TreatmentsModal taskId={treatmentsTaskId} opened={treatmentsOpened} onClose={closeTreatments} />}

            <Table miw={800} verticalSpacing="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th style={{ width: rem(40) }}>
                            <Checkbox
                                onChange={toggleAll}
                                checked={selection.length === data.length}
                                indeterminate={selection.length > 0 && selection.length !== data.length}
                            />
                        </Table.Th>
                        <Table.Th>Task Name</Table.Th>
                        <Table.Th>Cron</Table.Th>
                        <Table.Th>Function Type</Table.Th>
                        <Table.Th></Table.Th>
                        <Table.Th style={{ width: rem(200) }}>
                            <ButtonMenu items={creationButtons} />
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </ScrollArea>
    );
}
