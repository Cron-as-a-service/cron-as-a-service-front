import {
    ActionIcon,
    Anchor,
    Box,
    Burger,
    Button,
    Center,
    Collapse,
    Divider,
    Drawer,
    Group,
    HoverCard,
    rem,
    ScrollArea,
    SimpleGrid,
    Text,
    ThemeIcon,
    UnstyledButton, useMantineColorScheme,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBook, IconCheck, IconChevronDown, IconCode, IconMoon, IconSun, } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import classes from './HeaderMegaMenu.module.css';
import cx from 'clsx';
import { useAuth0 } from '@auth0/auth0-react';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';

const mockdata = [
    {
        icon: IconCode,
        title: 'Open source',
        description: 'Our project was totally open-source',
        link: 'https://github.com/Cron-as-a-service'
    },
    {
        icon: IconBook,
        title: 'Documentation',
        description: 'Visit the documentation to lean how our project works',
        link: 'https://cron-as-a-service.gitbook.io/cron-as-a-service'
    }
];

export function HeaderMegaMenu() {
    const [drawerOpened, {toggle: toggleDrawer, close: closeDrawer}] = useDisclosure(false);
    const [linksOpened, {toggle: toggleLinks}] = useDisclosure(false);
    const theme = useMantineTheme();
    const {setColorScheme, colorScheme} = useMantineColorScheme();
    const { loginWithRedirect, isAuthenticated, user } = useAuth0();

    useEffect(() => {
        if(user && !user?.email_verified){
            notifications.update({
                color: 'red',
                title: 'Please verify your mail',
                message: 'You need to validate your account before',
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                loading: false,
                autoClose: 8000,
            });
        }
    }, [user?.email_verified]);

    const links = mockdata.map((item) => (
        <UnstyledButton className={classes.subLink} key={item.title} onClick={() => window.open(item.link, '_blank')}>
            <Group wrap="nowrap" align="flex-start">
                <ThemeIcon size={34} variant="default" radius="md">
                    <item.icon style={{width: rem(22), height: rem(22)}} color={theme.colors.blue[6]}/>
                </ThemeIcon>
                <div>
                    <Text size="sm" fw={500}>
                        {item.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                        {item.description}
                    </Text>
                </div>
            </Group>
        </UnstyledButton>
    ));

    return (
        <Box>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <Group h="100%" gap={0} visibleFrom="sm">
                        <a href="#" className={classes.link}>
                            Home
                        </a>
                        <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
                            <HoverCard.Target>
                                <a href="#" className={classes.link}>
                                    <Center inline>
                                        <Box component="span" mr={5}>
                                            Features
                                        </Box>
                                        <IconChevronDown
                                            style={{width: rem(16), height: rem(16)}}
                                            color={theme.colors.blue[6]}
                                        />
                                    </Center>
                                </a>
                            </HoverCard.Target>

                            <HoverCard.Dropdown style={{overflow: 'hidden'}}>
                                <Group justify="space-between" px="md">
                                    <Text fw={500}>Features</Text>
                                    <Anchor href="#" fz="xs">
                                        View all
                                    </Anchor>
                                </Group>

                                <Divider my="sm"/>

                                <SimpleGrid cols={2} spacing={0}>
                                    {links}
                                </SimpleGrid>

                                <div className={classes.dropdownFooter}>
                                    <Group justify="space-between">
                                        <div>
                                            <Text fw={500} fz="sm">
                                                Get started
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                Their food sources have decreased, and their numbers
                                            </Text>
                                        </div>
                                        <Button variant="default">Get started</Button>
                                    </Group>
                                </div>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    </Group>


                    <Group visibleFrom="sm">
                        <ActionIcon
                            onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
                            variant="default"
                            size="xl"
                            aria-label="Toggle color scheme"
                        >
                            {colorScheme === 'light' ?
                                <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5}/> :
                                <IconSun className={cx(classes.icon, classes.light)} stroke={1.5}/>
                            }
                        </ActionIcon>
                        {isAuthenticated ? <Button onClick={() => loginWithRedirect()} variant="default">Dashboard</Button> : <Button onClick={() => loginWithRedirect()} variant="default">Log in</Button>}
                    </Group>

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm"/>
                </Group>
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
                    <Divider my="sm"/>

                    <a href="#" className={classes.link}>
                        Home
                    </a>
                    <UnstyledButton className={classes.link} onClick={toggleLinks}>
                        <Center inline>
                            <Box component="span" mr={5}>
                                Features
                            </Box>
                            <IconChevronDown
                                style={{width: rem(16), height: rem(16)}}
                                color={theme.colors.blue[6]}
                            />
                        </Center>
                    </UnstyledButton>
                    <Collapse in={linksOpened}>{links}</Collapse>

                    <Divider my="sm"/>

                    <Group justify="center" grow pb="xl" px="md">
                        {isAuthenticated ? <Button onClick={() => loginWithRedirect()} variant="default">Dashboard</Button> : <Button onClick={() => loginWithRedirect()} variant="default">Log in</Button>}
                    </Group>
                    <Group justify="left" grow pb="xl" px="md">
                        <ActionIcon
                            onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
                            variant="default"
                            size="xl"
                            aria-label="Toggle color scheme"
                        >
                            {colorScheme === 'light' ?
                                <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5}/> :
                                <IconSun className={cx(classes.icon, classes.light)} stroke={1.5}/>
                            }
                        </ActionIcon>
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}