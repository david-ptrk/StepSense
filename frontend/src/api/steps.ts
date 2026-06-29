import { API_BASE_URL } from "../config";

export const syncSteps = async (steps: number, goal: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/steps/sync/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({steps, goal}),
        });
        return await response.json();
    } catch (error) {
        console.log('Sync failed:', error);
    }
};

export const getHistory = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/steps/`);
        return await response.json();
    } catch (error) {
        console.log('Fetch history failed:', error);
        return [];
    }
};