import { getDatabase, updateDatabase } from '../lib/database.js';

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        try {
            const db = getDatabase();
            res.json({
                success: true,
                suggestions: db.suggestions || []
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch suggestions'
            });
        }
    } else if (req.method === 'POST') {
        try {
            const { placeName, category, description, yourName } = req.body;
            
            if (!placeName || !category || !description) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields'
                });
            }
            
            const db = getDatabase();
            const newSuggestion = {
                id: Date.now(),
                placeName,
                category,
                description,
                yourName: yourName || 'Anonymous',
                timestamp: new Date().toLocaleDateString(),
                votes: 0
            };
            
            const suggestions = db.suggestions || [];
            suggestions.unshift(newSuggestion);
            
            updateDatabase({ suggestions });
            
            res.json({
                success: true,
                suggestion: newSuggestion
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to add suggestion'
            });
        }
    } else {
        res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }
}
