import { getDatabase, updateDatabase } from './database.js';

export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        try {
            const { suggestionId, userId } = req.body;
            
            // Validate input
            if (!suggestionId || !userId) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: suggestionId, userId'
                });
            }
            
            const db = getDatabase();
            const suggestions = [...(db.suggestions || [])];
            const userVotes = { ...(db.userVotes || {}) };
            
            // Check if user already voted for this suggestion
            if (userVotes[userId] && userVotes[userId].includes(suggestionId)) {
                return res.status(400).json({
                    success: false,
                    error: 'User has already voted for this suggestion'
                });
            }
            
            // Find the suggestion
            const suggestionIndex = suggestions.findIndex(s => s.id === suggestionId);
            if (suggestionIndex === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Suggestion not found'
                });
            }
            
            // Update vote count
            suggestions[suggestionIndex].votes = (suggestions[suggestionIndex].votes || 0) + 1;
            
            // Track user vote
            if (!userVotes[userId]) {
                userVotes[userId] = [];
            }
            userVotes[userId].push(suggestionId);
            
            // Update database
            updateDatabase({ suggestions, userVotes });
            
            res.status(200).json({
                success: true,
                suggestion: suggestions[suggestionIndex]
            });
        } catch (error) {
            console.error('Error processing vote:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to process vote'
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
