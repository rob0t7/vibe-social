import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = join(__dirname, 'database.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize database
async function initializeDatabase() {
    try {
        await fs.access(DB_FILE);
    } catch (error) {
        // File doesn't exist, create it with default data
        const defaultData = {
            suggestions: [
                {
                    id: 1,
                    placeName: "Bellagio Fountains",
                    category: "attraction",
                    description: "Iconic water show with music and lights. Free spectacular display every 15-30 minutes on the Strip.",
                    yourName: "Vegas Veteran",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 24
                },
                {
                    id: 2,
                    placeName: "The Sphere",
                    category: "show",
                    description: "Revolutionary entertainment venue with immersive experiences. Check out U2 or other amazing shows here.",
                    yourName: "Tech Enthusiast",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 19
                },
                {
                    id: 3,
                    placeName: "Top of the World Restaurant",
                    category: "restaurant",
                    description: "Revolving restaurant 800+ feet above the Strip at Stratosphere. Incredible 360° views while dining.",
                    yourName: "Foodie Guide",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 16
                },
                {
                    id: 4,
                    placeName: "Fremont Street Experience",
                    category: "attraction",
                    description: "Downtown Vegas pedestrian mall with LED canopy shows, street performers, and vintage Vegas vibes.",
                    yourName: "Old Vegas Fan",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 14
                },
                {
                    id: 5,
                    placeName: "Omnia Nightclub",
                    category: "bar",
                    description: "Premier nightclub at Caesars Palace with world-class DJs and stunning terrace overlooking the Strip.",
                    yourName: "Night Owl",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 12
                },
                {
                    id: 6,
                    placeName: "Forum Shops at Caesars",
                    category: "shopping",
                    description: "Luxury shopping with over 160 stores and restaurants in Roman-themed mall. Great for souvenirs or high-end shopping.",
                    yourName: "Shopaholic",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 11
                },
                {
                    id: 7,
                    placeName: "Blue Man Group",
                    category: "show",
                    description: "Unique multimedia theatrical experience combining music, comedy, and technology. Perfect entertainment after conference days.",
                    yourName: "Show Lover",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 10
                },
                {
                    id: 8,
                    placeName: "Red Rock Canyon",
                    category: "attraction",
                    description: "Stunning natural landscapes just 17 miles from the Strip. Great for hiking, scenic drives, and escaping the city.",
                    yourName: "Nature Explorer",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 9
                },
                {
                    id: 9,
                    placeName: "Bacchanal Buffet",
                    category: "restaurant",
                    description: "Award-winning buffet at Caesars Palace with over 500 dishes from around the world. Worth the splurge!",
                    yourName: "Buffet King",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 8
                },
                {
                    id: 10,
                    placeName: "SkyPod at Stratosphere",
                    category: "attraction",
                    description: "Observation deck with thrill rides 1,149 feet above ground. Amazing views and adrenaline rush.",
                    yourName: "Thrill Seeker",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 7
                },
                {
                    id: 11,
                    placeName: "Chandelier Bar",
                    category: "bar",
                    description: "Three-story bar inside the Cosmopolitan with unique cocktails and stunning crystal chandelier design.",
                    yourName: "Cocktail Connoisseur",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 6
                },
                {
                    id: 12,
                    placeName: "High Roller Observation Wheel",
                    category: "attraction",
                    description: "World's largest observation wheel with 30-minute rides offering 360° Strip views. Great for photos!",
                    yourName: "Photo Enthusiast",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 6
                },
                {
                    id: 13,
                    placeName: "Cirque du Soleil",
                    category: "show",
                    description: "Multiple shows available (O, KÀ, Mystère, etc.). World-class acrobatics and artistic performances.",
                    yourName: "Art Lover",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 5
                },
                {
                    id: 14,
                    placeName: "Publicus",
                    category: "coffee",
                    description: "Trendy coffee shop and eatery in downtown with artisanal coffee, great food, and hip atmosphere.",
                    yourName: "Coffee Addict",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 4
                },
                {
                    id: 15,
                    placeName: "Neon Museum",
                    category: "attraction",
                    description: "Outdoor museum showcasing iconic Vegas neon signs. Perfect for history buffs and unique photo ops.",
                    yourName: "History Buff",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 3
                },
                {
                    id: 16,
                    placeName: "Hell's Kitchen",
                    category: "restaurant",
                    description: "Gordon Ramsay's flagship restaurant at Caesars Palace. Experience the TV show atmosphere with exceptional food.",
                    yourName: "Reality TV Fan",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 2
                },
                {
                    id: 17,
                    placeName: "Container Park",
                    category: "attraction",
                    description: "Unique shopping and dining area in downtown made from shipping containers. Family-friendly with playground.",
                    yourName: "Urban Explorer",
                    timestamp: new Date().toLocaleDateString(),
                    votes: 1
                }
            ],
            userVotes: {}
        };
        
        await fs.writeFile(DB_FILE, JSON.stringify(defaultData, null, 2));
        console.log('Database initialized with default data');
    }
}

// Database helper functions
async function readDatabase() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        throw error;
    }
}

async function writeDatabase(data) {
    try {
        await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing database:', error);
        throw error;
    }
}

// API Routes

// Get all suggestions
app.get('/api/suggestions', async (req, res) => {
    try {
        const db = await readDatabase();
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
});

// Add a new suggestion
app.post('/api/suggestions', async (req, res) => {
    try {
        const { placeName, category, description, yourName } = req.body;
        
        if (!placeName || !category || !description) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        const db = await readDatabase();
        const newSuggestion = {
            id: Date.now(),
            placeName,
            category,
            description,
            yourName: yourName || 'Anonymous',
            timestamp: new Date().toLocaleDateString(),
            votes: 0
        };
        
        db.suggestions = db.suggestions || [];
        db.suggestions.unshift(newSuggestion);
        
        await writeDatabase(db);
        
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
});

// Vote for a suggestion
app.post('/api/suggestions/:id/vote', async (req, res) => {
    try {
        const suggestionId = parseInt(req.params.id);
        const { userId } = req.body; // Simple user identification
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID required'
            });
        }
        
        const db = await readDatabase();
        db.userVotes = db.userVotes || {};
        
        // Check if user already voted for this suggestion
        if (db.userVotes[userId] && db.userVotes[userId].includes(suggestionId)) {
            return res.status(400).json({
                success: false,
                error: 'User has already voted for this suggestion'
            });
        }
        
        // Find and update the suggestion
        const suggestion = db.suggestions.find(s => s.id === suggestionId);
        if (!suggestion) {
            return res.status(404).json({
                success: false,
                error: 'Suggestion not found'
            });
        }
        
        // Update vote count
        suggestion.votes = (suggestion.votes || 0) + 1;
        
        // Track user vote
        if (!db.userVotes[userId]) {
            db.userVotes[userId] = [];
        }
        db.userVotes[userId].push(suggestionId);
        
        await writeDatabase(db);
        
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
});

// Get user's votes
app.get('/api/user/:userId/votes', async (req, res) => {
    try {
        const { userId } = req.params;
        const db = await readDatabase();
        
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
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// Start server
async function startServer() {
    await initializeDatabase();
    
    app.listen(PORT, () => {
        console.log(`🎰 ETLS Vegas Suggestions server running on http://localhost:${PORT}`);
        console.log('📁 Database file:', DB_FILE);
    });
}

startServer().catch(console.error);
