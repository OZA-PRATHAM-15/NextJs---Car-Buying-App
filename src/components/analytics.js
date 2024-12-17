export const trackHoverEvent = async (carId, carName) => {
    try {
        await fetch('http://localhost:5000/api/analytics/hover', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ carId, carName }),
        });
    } catch (error) {
        console.error('Error tracking hover event:', error);
    }
};
export const sendFilterAnalytics = async (filters) => {
    try {
        const res = await fetch('http://localhost:5000/api/analytics/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filters,
                timestamp: new Date().toISOString(), // Optional for reference
            }),
        });

        if (!res.ok) {
            console.error('Failed to send filter analytics');
        }
    } catch (error) {
        console.error('Error sending filter analytics:', error);
    }
};