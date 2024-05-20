import { useState } from 'react';
import { Code, Group, Text } from '@mantine/core';
import { IconClockRecord, IconLogout, IconUser, } from '@tabler/icons-react';
import classes from './NavbarSimple.module.css';
import { useAuth0 } from '@auth0/auth0-react';

const data = [
    { link: '', label: 'CronTasks', icon: IconClockRecord },
];

export function NavbarSimple() {
    const [active, setActive] = useState('CronTasks');
    const { logout, user } = useAuth0();

    const links = data.map((item) => (
        <a
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Group className={classes.header} justify="space-between">
                    <Text>CronAsAService</Text>
                    <Code fw={700}>v0.0.1</Code>
                </Group>
                {links}
            </div>

            <div className={classes.footer}>
                <a className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconUser className={classes.linkIcon} stroke={1.5}/>
                    <span>{user?.nickname}</span>
                </a>

                <a href="#" onClickCapture={() => logout({ logoutParams: { returnTo: window.location.origin }})} className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconLogout className={classes.linkIcon} stroke={1.5}/>
                    <span>Logout</span>
                </a>
            </div>
        </nav>
    );
}