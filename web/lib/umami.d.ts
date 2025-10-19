interface Window {
    umami: {
        track: (event_name: string, event_data?: Record<string, any>) => void;
    };
}
