import { Container, Text, Button, Group } from '@mantine/core';
import { GithubIcon } from '@mantinex/dev-icons';
import classes from './HeroTitle.module.css';

export function HeroTitle() {
    return (
        <div className={classes.wrapper}>
            <Container size={700} className={classes.inner}>
                <h1 className={classes.title}>
                    A{' '}
                    <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
                        SaaS
                    </Text>{' '}
                    to manage and create all CronTask you NEED !
                </h1>

                <Text className={classes.description} color="dimmed">
                    Build Custom Cron to call your api or make treatment on your data
                </Text>

                <Group className={classes.controls}>
                    <Button
                        size="xl"
                        className={classes.control}
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'cyan' }}
                    >
                        Get started
                    </Button>

                    <Button
                        component="a"
                        href="https://github.com/"
                        size="xl"
                        variant="default"
                        className={classes.control}
                        leftSection={<GithubIcon size={20} />}
                    >
                        GitHub
                    </Button>
                </Group>
            </Container>
        </div>
    );
}