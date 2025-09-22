import { getDatabase } from '../../../lib/database.js';

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        try {
            const { userId } = req.query;
            const db = getDatabase();
            
            res.json({
                success: true,
                votes: db.userVotes[userId] || []
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch user votes'
            });
        }
    } else {
        res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }
}
