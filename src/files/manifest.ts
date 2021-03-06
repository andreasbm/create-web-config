import { INewCommandConfig } from "../model";

export const manifestTemplate = ({dir}: INewCommandConfig) => `{
    "name": "${dir}",
    "short_name": "${dir}",
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "display": "standalone",
    "start_url": "/",
    "lang": "en-US",
    "icons": [
        {
            "src": "https://raw.githubusercontent.com/andreasbm/weightless/master/assets/www/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "https://raw.githubusercontent.com/andreasbm/weightless/master/assets/www/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}`;