function getEnvVariable(key: string): string {
    const value = import.meta.env[key] || window.env[key as keyof typeof window.env];
    if (!value) {
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
}

export const config = {
    datadogAppId: getEnvVariable('VITE_REACT_APP_DATADOG_APP_ID'),
    datadogAppToken: getEnvVariable('VITE_REACT_APP_DATADOG_APP_TOKEN'),
    datadogAppSite: getEnvVariable('VITE_REACT_APP_DATADOG_APP_SITE'),
    datadogAppService: getEnvVariable('VITE_REACT_APP_DATADOG_APP_SERVICE'),
    datadogAppEnv: getEnvVariable('VITE_REACT_APP_DATADOG_APP_ENV'),
    authDomain: getEnvVariable('VITE_REACT_APP_AUTH0_DOMAIN'),
    authClient: getEnvVariable('VITE_REACT_APP_AUTH0_CLIENT_ID'),
    authRedirectUrl: getEnvVariable('VITE_REACT_APP_AUTH0_REDIRECT_URI'),
    apiUrl:getEnvVariable('VITE_REACT_APP_API_URL')
};