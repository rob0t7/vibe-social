import { getDatabase, updateDatabase } from '../../../lib/database.js';

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        try {
            const { id } = req.query;
            const suggestionId = parseInt(id);
            const { userId } = req.body;
            
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'User ID required'
                });
            }
            
            const db = getDatabase();
            const userVotes = db.userVotes || {};
            
            // Check if user already voted for this suggestion
            if (userVotes[userId] && userVotes[userId].includes(suggestionId)) {
                return res.status(400).json({
                    success: false,
                    error: 'User has already voted for this suggestion'
                });
            }
            
            // Find and update the suggestion
            const suggestions = [...(db.suggestions || [])];
            const suggestion = suggestions.find(s => s.id === suggestionId);
            if (!suggestion) {
                return res.status(404).json({
                    success: false,
                    error: 'Suggestion not found'
                });
            }
            
            // Update vote count
            suggestion.votes = (suggestion.votes || 0) + 1;
            
            // Track user vote
            if (!userVotes[userId]) {
                userVotes[userId] = [];
            }
            userVotes[userId].push(suggestionId);
            
            updateDatabase({ suggestions, userVotes });
            
            res.json({
                success: true,
                suggestion
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to vote for suggestion'
            });
        }
    } else {
        res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }
}
