import express from 'express';
import cors from 'cors';
import fs from 'fs';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import morgan from 'morgan';
import compression from 'compression';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.static(join(__dirname, '../dist'), { maxAge: '3d' }));
app.use(morgan('dev'));
app.use(compression());

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

app.post('/api/generate-message', async (req, res) => {
    try {
        const { input } = req.body;
        console.log(input);
        // const user = await User.findOne({ userId });
        // if (!user || user.credits < 1) {
        //     return res.status(403).json({ error: 'Insufficient credits' });
        // }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: input }]
        });

        // user.credits -= 1;
        // user.messages.push({
        //     content: completion.choices[0].message.content,
        //     createdAt: new Date()
        // });
        // await user.save();

        res.json({ textResponse: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error generating message:', error);
        res.status(500).json({ error: 'An error occurred while generating the message' });
    }
});

app.get('/api/user-credits', async (req, res) => {
    const userId = req.query.userId;
    const user = await User.findOne({ userId });
    res.json({ credits: user ? user.credits : 0 });
});

app.post('/api/use-credit', async (req, res) => {
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

app.get('/api/themes', (req, res) => {
    const themes = ['Winter Wonderland', 'Cozy Fireplace', "Santa's Workshop"];
    res.json({ themes });
});

app.post('/api/save-message', async (req, res) => {
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

app.get('/api/message-history', async (req, res) => {
    const userId = req.query.userId;
    const user = await User.findOne({ userId });
    res.json({ history: user ? user.messages : [] });
});

app.post('/api/daily-reward', async (req, res) => {
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

app.get('*', async (req, res) => {
    return res.send(fs.readFileSync(join(__dirname, '../dist/index.html'), 'utf8'));
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

process.on('uncaughtException', (err, origin) => {
    console.error(`Caught exception: ${err}`, `Exception origin: ${origin}`);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
