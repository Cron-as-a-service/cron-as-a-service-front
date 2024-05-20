import { useState } from 'react';
import {
    Button,
    Center,
    Code,
    Group,
    Modal,
    Radio,
    rem,
    Select,
    Space,
    Stack,
    Stepper,
    Text,
    TextInput,
    Tooltip
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { RadioCard } from '../CheckboxCard/RadioCard.tsx';
import { IconApi, IconCheck, IconDownload, IconHttpGet, IconX } from '@tabler/icons-react';
import { Attribute, getTargetUrlAttributes } from '../../services/api/targetUrlAnalyser.service.ts';
import { CheckboxList } from '../CheckboxList/CheckboxList.tsx';
import { Cron } from 'react-js-cron'
import 'react-js-cron/dist/styles.css'
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { useAuth0 } from '@auth0/auth0-react';
import { config } from '../../config/env.config.ts';

interface CreateCronModalProps {
    opened: boolean;
    onClose: () => void;
}

export function CreateCronModal({opened, onClose}: CreateCronModalProps) {
    const [active, setActive] = useState(0);
    const [cronValue, setCronValue] = useState('* * * * *')
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const {user} = useAuth0();
    const nextStep = async () => {
        const isValid = form.validate();
        if (!isValid.hasErrors) {
            setActive((current) => (current < 2 ? current + 1 : current));
        }
    };
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const form = useForm({
        mode: 'controlled',
        initialValues: {
            cronName: '',
            httpMethod: '',
            targetUrl: '',
            treatment: '',
            idAttribute: '',
            diffType: '',
            attributes: [] as string[]
        },
        validate: {
            targetUrl: (value) =>
                /(https?:\/\/)?((([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}|localhost)(:\d+)?)(\/\S*)?/.test(
                    value
                )
                    ? null
                    : 'Invalid Url',
            cronName: (value) => (value.length > 0 ? null : 'Cron name is required'),
            idAttribute: (value, values) => (active < 1 || values.treatment != "differential" || value.length > 0 ? null : 'Attribute id is required'),
            attributes: (value, values) => (active < 1 || values.treatment != "differential" || values.diffType != "update" || value.length > 0 ? null : 'You need to select 1 filter attributes'),
            diffType: (value, values) => (active < 1 || values.treatment != "differential" || value.length > 0 ? null : 'You need to select a differential type'),
        },
    });

    const handleRadioChange = (path:string, value: string) => {
        form.setFieldValue(path, value);
        form.validate();
    };

    const handleGetAttributes = async () => {
        setAttributes(await getTargetUrlAttributes(form.values.targetUrl, form.values.httpMethod));
    }

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
            title: `Create cron ${values.cronName}`,
            message: 'Cron will be create in few seconds, you cannot close this yet',
            autoClose: false,
            withCloseButton: false,
        });

        const body = {
            name: values.cronName,
            userId: user?.sub,
            cron: cronValue,
            functionType: values.treatment,
            httpMethod: values.httpMethod,
            targetUrl: values.targetUrl,
            filters: values.attributes,
            objectId: values.idAttribute,
            differential: values.diffType,
        };

        axios.post(`${config.apiUrl}/task`, body)
            .then(() => {
                notifications.update({
                    id,
                    color: 'teal',
                    title: 'Cron was created',
                    message: 'Everything is fine',
                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 8000,
                });
                handleClose()// fermer la modal
            })
            .catch((error) => {
                console.error(error);
                notifications.update({
                    id,
                    color: 'red',
                    title: 'Cron wasn\'t created',
                    message: `Something went wrong, ${error.message}`,
                    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 6000,
                });
            });
    };

    const handleClose = () => {
        onClose(); // fermer la modal
        setActive(0); // réinitialiser l'étape active à 0
        setAttributes([]); // réinitialiser la liste des attributs à vide
        setCronValue('* * * * *')
        form.reset(); // réinitialiser le formulaire
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Create a new CRON" size={'xl'}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
                    <Stepper.Step label="First step" description="General cron information">
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
                        <Space h="xs"/>
                        <Cron value={cronValue} setValue={setCronValue} clearButtonProps={{
                            type: 'primary',
                            color: 'blue',
                            style: {color: 'white', backgroundColor: '#1971c2'}
                        }}/>
                    </Stepper.Step>
                    <Stepper.Step label="Second step" description="Data transformation">
                        <Center>
                                <Radio.Group
                                    name="treatment"
                                    key={form.key('treatment')}
                                    {...form.getInputProps('treatment')}
                                    withAsterisk>
                                    <Group>
                                        {form.values.httpMethod == 'GET' && <Tooltip label="Checkbox with tooltip 1">
                                            <Radio
                                                value="differential"
                                                label="Differential"
                                            />
                                        </Tooltip>}
                                        <Tooltip label="Checkbox with tooltip 2">
                                            <Radio
                                                value="none"
                                                label="None"
                                            />
                                        </Tooltip>
                                    </Group>
                                </Radio.Group>
                        </Center>
                        {form.values.treatment == 'differential' && <Stack>
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
                                withAsterisk>
                                <Group>
                                    <RadioCard label="New" description="Select only new objects" name="new" onClick={() => handleRadioChange('diffType', 'new')}/>
                                    <RadioCard label="Delete" description="Select only delete objects" name="delete" onClick={() => handleRadioChange('diffType', 'delete')}/>
                                    <RadioCard label="Update" description="Select only update object" name="update" onClick={() => handleRadioChange('diffType', 'update')}/>
                                    {form.values.diffType == 'update' &&
                                        <Center>
                                            {attributes.length == 0 ? <Button
                                                variant="light"
                                                size="md"
                                                onClick={handleGetAttributes}
                                                leftSection={<IconApi size={24} />}
                                                rightSection={<><IconHttpGet size={22} /><IconDownload size={16} /></>}
                                            >
                                                Get all object attributes
                                            </Button> :
                                                <CheckboxList
                                                    attributes={attributes}
                                                    onChange={handleAttributeChange}
                                                />
                                            }
                                        </Center>
                                    }
                                </Group>
                            </Radio.Group>
                            {form.errors.attributes &&
                                <Text size="sm" c="red">
                                    {form.errors.attributes}
                                </Text>
                            }
                        </Stack>}
                    </Stepper.Step>
                    <Stepper.Step label="Final step" description="Create cron">
                        <Stack>
                            <Text size="sm" w={500}>
                                Cron name:  <Code>{form.values.cronName}</Code>
                            </Text>
                            <Text size="sm" w={500}>
                                HTTP method: <Code>{form.values.httpMethod}</Code>
                            </Text>
                            <Text size="sm" w={500}>
                                Target URL: <Code>{form.values.targetUrl}</Code>
                            </Text>
                            <Text size="sm" w={500}>
                                Treatment: <Code>{form.values.treatment}</Code>
                            </Text>
                            <Text size="sm" w={500}>
                                Cron: <Code>{cronValue}</Code>
                            </Text>
                            {form.values.treatment === 'differential' && (
                                <>
                                    <Text size="sm" w={500}>
                                        Id attribute: <Code>{form.values.idAttribute}</Code>
                                    </Text>
                                    <Text size="sm" w={500}>
                                        Diff type: <Code>{form.values.diffType}</Code>
                                    </Text>
                                    {form.values.diffType == 'update' && <Text size="sm" w={500}>
                                        Filters: <Code>{form.values.attributes.join(', ')}</Code>
                                    </Text>}
                                </>
                            )}
                        </Stack>
                        <Center><Button type="submit">Create</Button></Center>
                    </Stepper.Step>
                    <Stepper.Completed>
                        Completed, click back button to get to previous step
                    </Stepper.Completed>
                </Stepper>

                <Group justify="center" mt="xl">
                    <Button variant="default" onClick={prevStep}>
                        Previous
                    </Button>
                    {active == 2 ? (
                            <></>
                    ) : (
                        <Button onClick={nextStep}>Next step</Button>
                    )}
                </Group>
            </form>
        </Modal>
    );
}