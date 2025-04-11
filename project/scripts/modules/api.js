// scripts/modules/api.js
export async function fetchLessons() {
    try {
        const response = await fetch('data/lessons.json');
        if (!response.ok) throw new Error('Failed to fetch lessons');
        return await response.json();
    } catch (error) {
        console.error('Error loading lessons:', error);
        return [];
    }
}

export async function fetchTools() {
    try {
        const response = await fetch('data/tools.json');
        if (!response.ok) throw new Error('Failed to fetch tools');
        return await response.json();
    } catch (error) {
        console.error('Error loading tools:', error);
        return null;
    }
}