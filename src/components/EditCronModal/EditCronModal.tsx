import { useState, useEffect } from 'react';
import {
    Button,
    Center,
    Group,
    Modal,
    Radio,
    rem,
    Select,
    Space,
    Stack,
    Text,
    TextInput,
    Tooltip
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconApi, IconCheck, IconDownload, IconHttpGet, IconX } from '@tabler/icons-react';
import { Attribute, getTargetUrlAttributes } from '../../services/api/targetUrlAnalyser.service.ts';
import { CheckboxList } from '../CheckboxList/CheckboxList.tsx';
import { Cron } from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { RadioCard } from '../CheckboxCard/RadioCard.tsx';
import { Task } from '../../models/task.model.ts';
import { config } from '../../config/env.config.ts';

interface EditCronModalProps {
    task: Task;
    opened: boolean;
    onClose: () => void;
}

export function EditCronModal({ task, opened, onClose }: EditCronModalProps) {
    const [cronValue, setCronValue] = useState(task.cron);
    const [attributes, setAttributes] = useState<Attribute[]>([]);

    const form = useForm({
        mode: 'controlled',
        initialValues: {
            cronName: task.name,
            httpMethod: task.httpMethod,
            targetUrl: task.targetUrl,
            treatment: task.function,
            idAttribute: task.objectId,
            diffType: task.differential,
            attributes: task.filters
        },
        validate: {
            targetUrl: (value) =>
                /(https?:\/\/)?((([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}|localhost)(:\d+)?)(\/\S*)?/.test(value)
                    ? null
                    : 'Invalid Url',
            cronName: (value) => (value.length > 0 ? null : 'Cron name is required'),
            idAttribute: (value, values) => (values.treatment !== 'differential' || value.length > 0 ? null : 'Attribute id is required'),
            attributes: (value, values) => (values.treatment !== 'differential' || values.diffType !== 'update' || value.length > 0 ? null : 'You need to select 1 filter attributes'),
            diffType: (value, values) => (values.treatment !== 'differential' || value.length > 0 ? null : 'You need to select a differential type'),
        },
    });

    useEffect(() => {
        if (opened) {
            form.setValues({
                cronName: task.name,
                httpMethod: task.httpMethod,
                targetUrl: task.targetUrl,
                treatment: task.function,
                idAttribute: task.objectId,
                diffType: task.differential,
                attributes: task.filters
            });
            setCronValue(task.cron);
            setAttributes([]);
        }
    }, [task, opened]);

    const handleRadioChange = (path: string, value: string) => {
        form.setFieldValue(path, value);
        form.validate();
    };

    const handleGetAttributes = async () => {
        setAttributes(await getTargetUrlAttributes(form.values.targetUrl, form.values.httpMethod));
    };

    const handleAttributeChange = (selectedAttributes: string[]) => {
        const updatedAttributes = attributes.map((attribute) => ({
            ...attribute,
            checked: selectedAttributes.includes(attribute.label),
        }));
        setAttributes(updatedAttributes);
        form.setFieldValue('attributes', selectedAttributes);
    };

    const handleSubmit = (values: typeof form.values) => {
        const id = notifications.show({
            loading: true,
            title: `Edit cron ${values.cronName}`,
            message: 'Cron will be updated in a few seconds, you cannot close this yet',
            autoClose: false,
            withCloseButton: false,
        });

        const body = {
            name: values.cronName,
            userId: task.userId,
            cron: cronValue,
            functionType: values.treatment,
            httpMethod: values.httpMethod,
            targetUrl: values.targetUrl,
            filters: values.attributes,
            objectId: values.idAttribute,
            differential: values.diffType,
        };

        axios.put(`${config.apiUrl}/task/${task.id}`, body)
            .then(() => {
                notifications.update({
                    id,
                    color: 'teal',
                    title: 'Cron was updated',
                    message: 'Everything is fine',
                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 8000,
                });
                handleClose(); // fermer la modal
            })
            .catch((error) => {
                notifications.update({
                    id,
                    color: 'red',
                    title: 'Cron wasn\'t updated',
                    message: `Something went wrong, ${error.message}`,
                    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 6000,
                });
            });
    };

    const handleClose = () => {
        onClose(); // fermer la modal
        form.reset(); // réinitialiser le formulaire
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Edit CRON" size={'xl'}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <TextInput
                        withAsterisk
                        label="Cron name"
                        placeholder="your cron name"
                        key={form.key('cronName')}
                        {...form.getInputProps('cronName')}
                    />
                    <Select
                        withAsterisk
                        label="HTTP method"
                        placeholder="select http method"
                        data={['GET', 'POST', 'PUT']}
                        key={form.key('httpMethod')}
                        {...form.getInputProps('httpMethod')}
                    />
                    <TextInput
                        withAsterisk
                        label="Target URL"
                        placeholder="your target url"
                        key={form.key('targetUrl')}
                        {...form.getInputProps('targetUrl')}
                    />
                    <TextInput label="Cron" readOnly value={cronValue} withAsterisk />
                    <Space h="xs" />
                    <Cron value={cronValue} setValue={setCronValue} clearButtonProps={{
                        type: 'primary',
                        color: 'blue',
                        style: { color: 'white', backgroundColor: '#1971c2' }
                    }} />
                </Stack>
                <Space h="md" />
                <Center>
                    <Radio.Group
                        name="treatment"
                        key={form.key('treatment')}
                        {...form.getInputProps('treatment')}
                        withAsterisk
                        value={form.values.treatment}
                    >
                        <Group>
                            {form.values.httpMethod === 'GET' && (
                                <Tooltip label="Make a differential since last get">
                                    <Radio value="differential" label="Differential" />
                                </Tooltip>
                            )}
                            <Tooltip label="Just call url with specified method">
                                <Radio value="none" label="None" />
                            </Tooltip>
                        </Group>
                    </Radio.Group>
                </Center>
                {form.values.treatment === 'differential' && (
                    <Stack>
                        <TextInput
                            withAsterisk
                            label="Id attribute name"
                            placeholder="name of id attribute"
                            key={form.key('idAttribute')}
                            {...form.getInputProps('idAttribute')}
                        />
                        <Radio.Group
                            name="diffType"
                            key={form.key('diffType')}
                            {...form.getInputProps('diffType')}
                            withAsterisk
                            value={form.values.diffType}
                        >
                            <Group>
                                <RadioCard label="New" description="Select only new objects" name="new" onClick={() => handleRadioChange('diffType', 'new')} />
                                <RadioCard label="Delete" description="Select only delete objects" name="delete" onClick={() => handleRadioChange('diffType', 'delete')} />
                                <RadioCard label="Update" description="Select only update object" name="update" onClick={() => handleRadioChange('diffType', 'update')} />
                                {form.values.diffType === 'update' && (
                                    <Center>
                                        {attributes.length === 0 ? (
                                            <Button
                                                variant="light"
                                                size="md"
                                                onClick={handleGetAttributes}
                                                leftSection={<IconApi size={24} />}
                                                rightSection={<><IconHttpGet size={22} /><IconDownload size={16} /></>}
                                            >
                                                Get all object attributes
                                            </Button>
                                        ) : (
                                            <CheckboxList
                                                attributes={attributes}
                                                onChange={handleAttributeChange}
                                            />
                                        )}
                                    </Center>
                                )}
                            </Group>
                        </Radio.Group>
                        {form.errors.attributes && (
                            <Text size="sm" c="red">
                                {form.errors.attributes}
                            </Text>
                        )}
                    </Stack>
                )}
                <Space h="md" />
                <Center>
                    <Button type="submit">Update</Button>
                </Center>
            </form>
        </Modal>
    );
}
