import { getDatabase, updateDatabase } from './database.js';

export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        try {
            const db = getDatabase();
            res.status(200).json({
                success: true,
                suggestions: db.suggestions || []
            });
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch suggestions'
            });
        }
    } 
    else if (req.method === 'POST') {
        try {
            const { placeName, category, description, yourName } = req.body;
            
            // Validate required fields
            if (!placeName || !category || !description) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: placeName, category, description'
                });
            }
            
            const db = getDatabase();
            
            // Create new suggestion
            const newSuggestion = {
                id: Date.now(),
                placeName: placeName.trim(),
                category: category.trim(),
                description: description.trim(),
                yourName: (yourName || 'Anonymous').trim(),
                timestamp: new Date().toLocaleDateString(),
                votes: 0
            };
            
            // Add to suggestions array
            const updatedSuggestions = [newSuggestion, ...(db.suggestions || [])];
            updateDatabase({ suggestions: updatedSuggestions });
            
            res.status(201).json({
                success: true,
                suggestion: newSuggestion
            });
        } catch (error) {
            console.error('Error adding suggestion:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to add suggestion'
            });
        }
    }
    else {
        res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }
}
