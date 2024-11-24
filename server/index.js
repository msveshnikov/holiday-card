import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

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

mongoose.connect(process.env.MONGODB_URI, {});

const UserSchema = new mongoose.Schema({
    userId: String,
    credits: Number,
    messages: [{ content: String, createdAt: Date }],
    lastDailyReward: Date
});

const User = mongoose.model('User', UserSchema);

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
            emojis,
            userId
        } = req.body;

        const user = await User.findOne({ userId });
        if (!user || user.credits < 1) {
            return res.status(403).json({ error: 'Insufficient credits' });
        }

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

        user.credits -= 1;
        user.messages.push({
            content: completion.choices[0].message.content,
            createdAt: new Date()
        });
        await user.save();

        res.json({ message: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error generating message:', error);
        res.status(500).json({ error: 'An error occurred while generating the message' });
    }
});

app.get('/user-credits', async (req, res) => {
    const userId = req.query.userId;
    const user = await User.findOne({ userId });
    res.json({ credits: user ? user.credits : 0 });
});

app.post('/use-credit', async (req, res) => {
    const { userId } = req.body;
    const user = await User.findOne({ userId });
    if (user && user.credits > 0) {
        user.credits -= 1;
        await user.save();
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.get('/themes', (req, res) => {
    const themes = ['Winter Wonderland', 'Cozy Fireplace', "Santa's Workshop"];
    res.json({ themes });
});

app.post('/save-message', async (req, res) => {
    const { userId, message } = req.body;
    const user = await User.findOne({ userId });
    if (user) {
        user.messages.push({ content: message, createdAt: new Date() });
        await user.save();
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.get('/message-history', async (req, res) => {
    const userId = req.query.userId;
    const user = await User.findOne({ userId });
    res.json({ history: user ? user.messages : [] });
});

app.post('/daily-reward', async (req, res) => {
    const { userId } = req.body;
    const user = await User.findOne({ userId });
    if (user) {
        const today = new Date().setHours(0, 0, 0, 0);
        if (!user.lastDailyReward || user.lastDailyReward < today) {
            user.credits += 1;
            user.lastDailyReward = new Date();
            await user.save();
            res.json({ reward: 1 });
        } else {
            res.json({ reward: 0 });
        }
    } else {
        res.json({ reward: 0 });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
