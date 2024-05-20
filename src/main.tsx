import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createTheme, MantineColorsTuple, MantineProvider } from '@mantine/core';
import { App } from './pages/App.tsx';
import { Notifications } from '@mantine/notifications';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard.tsx';
import { Auth0Provider } from '@auth0/auth0-react';
import { datadogRum } from '@datadog/browser-rum';
import '@mantine/notifications/styles.css';
import { config } from './config/env.config.ts';

const myColor: MantineColorsTuple = [
    '#eef3ff',
    '#dce4f5',
    '#b9c7e2',
    '#94a8d0',
    '#748dc1',
    '#5f7cb8',
    '#5474b4',
    '#44639f',
    '#39588f',
    '#2d4b81'
];

const theme = createTheme({
    colors: {
        myColor,
    }
});

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
    },
    {
        path: '/dashboard',
        element: <Dashboard/>
    }
]);

const appId = config.datadogAppId;
const clientToken = config.datadogAppToken;
const site = config.datadogAppSite;
const service = config.datadogAppService;
const env = config.datadogAppEnv;

datadogRum.init({
    applicationId: appId,
    clientToken: clientToken,
    site: site,
    service: service,
    env: env,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 0,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
});

const domain = config.authDomain;
const clientId = config.authClient;
const redirectUrl = config.authRedirectUrl;

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MantineProvider theme={theme}>
            <Notifications/>
            <Auth0Provider
                domain={domain}
                clientId={clientId}
                cacheLocation="localstorage"
                authorizationParams={{
                    redirect_uri: window.location.origin + redirectUrl
                }}
            >
                <RouterProvider router={router}/>
            </Auth0Provider>
        </MantineProvider>
    </React.StrictMode>,
)
