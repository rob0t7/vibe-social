import { getDatabase } from './database.js';

export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        try {
            const { userId } = req.query;
            
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required parameter: userId'
                });
            }
            
            const db = getDatabase();
            const userVotes = db.userVotes || {};
            
            res.status(200).json({
                success: true,
                votes: userVotes[userId] || []
            });
        } catch (error) {
            console.error('Error fetching user votes:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch user votes'
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
