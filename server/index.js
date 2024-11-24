import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

app.use(cors());
app.use(express.json({ limit: '15mb' }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);

app.post('/generate-message', async (req, res) => {
    try {
        const {
            style,
            tone,
            recipient,
            relationship,
            occasions,
            jokes,
            interests,
            events,
            additions,
            emojis
        } = req.body;

        const prompt = `Generate a Christmas card message with the following details:
    Style: ${style}
    Tone: ${tone}
    Recipient: ${recipient}
    Relationship: ${relationship}
    Special occasions/memories: ${occasions}
    Inside jokes: ${jokes}
    Shared interests: ${interests}
    Recent events: ${events}
    Custom message additions: ${additions}
    Emoji preferences: ${emojis}`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }]
        });

        res.json({ message: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error generating message:', error);
        res.status(500).json({ error: 'An error occurred while generating the message' });
    }
});

app.get('/user-credits', (req, res) => {
    const userId = req.query.userId;
    const credits = getUserCredits(userId);
    res.json({ credits });
});

app.post('/use-credit', (req, res) => {
    const { userId } = req.body;
    const success = useCredit(userId);
    res.json({ success });
});

app.get('/themes', (req, res) => {
    const themes = getThemes();
    res.json({ themes });
});

app.post('/save-message', (req, res) => {
    const { userId, message } = req.body;
    const success = saveMessage(userId, message);
    res.json({ success });
});

app.get('/message-history', (req, res) => {
    const userId = req.query.userId;
    const history = getMessageHistory(userId);
    res.json({ history });
});

app.post('/referral', (req, res) => {
    const { userId, referralCode } = req.body;
    const success = processReferral(userId, referralCode);
    res.json({ success });
});

app.post('/daily-reward', (req, res) => {
    const { userId } = req.body;
    const reward = claimDailyReward(userId);
    res.json({ reward });
});

function getUserCredits(userId) {
    return 10;
}

function useCredit(userId) {
    return true;
}

function getThemes() {
    return ['Winter Wonderland', 'Cozy Fireplace', "Santa's Workshop"];
}

function saveMessage(userId, message) {
    return true;
}

function getMessageHistory(userId) {
    return [];
}

function processReferral(userId, referralCode) {
    return true;
}

function claimDailyReward(userId) {
    return 1;
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
