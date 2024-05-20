import { Button, Menu, rem, Text } from '@mantine/core';
import { IconChevronDown, } from '@tabler/icons-react';
import { DropdownItem } from '../interfaces/DropdownItem.tsx';

interface DropdownButtonProps {
    items: DropdownItem[];
}

/*
<IconPackage
                            style={{ width: rem(16), height: rem(16) }}
                            color={theme.colors.blue[6]}
                            stroke={1.5}
                        />
* */

export function ButtonMenu({ items }: DropdownButtonProps) {
    return (
        <Menu
            transitionProps={{ transition: 'pop-top-right' }}
            position="top-end"
            width={220}
            withinPortal
        >
            <Menu.Target>
                <Button
                    rightSection={
                        <IconChevronDown style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                    }
                    pr={12}
                >
                    Create new
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                {items.map((item, index) => (
                    <Menu.Item
                        key={index}
                        onClick={item.onClick}
                        leftSection={
                            item.icon
                        }
                        rightSection={
                            item.label && <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                                item.label
                            </Text>
                        }
                    >
                        {item.title}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
}