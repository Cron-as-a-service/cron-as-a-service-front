/// <reference types="vite/client" />
interface Window {
    env: {
        VITE_REACT_APP_DATADOG_APP_ID: string;
        VITE_REACT_APP_DATADOG_APP_TOKEN: string;
        VITE_REACT_APP_DATADOG_APP_SITE: string;
        VITE_REACT_APP_DATADOG_APP_SERVICE: string;
        VITE_REACT_APP_DATADOG_APP_ENV: string;
        VITE_REACT_APP_AUTH0_DOMAIN: string;
        VITE_REACT_APP_AUTH0_CLIENT_ID: string;
        VITE_REACT_APP_AUTH0_REDIRECT_URI: string;
        VITE_REACT_APP_API_URL: string;
    };
}