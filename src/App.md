# AI Christmas Card Message Generator Documentation

## Overview

The `App.jsx` file is the main component of a React application that generates personalized
Christmas card messages using AI. It provides a user-friendly interface built with Chakra UI
components, allowing users to customize messages based on various parameters like style, tone, and
personal details.

## Component Structure

### App Component

The main functional component that manages the entire application state and UI.

## State Management

```javascript
const [messageStyle, setMessageStyle] = useState('formal');
const [tone, setTone] = useState(50);
const [recipientName, setRecipientName] = useState('');
const [relationship, setRelationship] = useState('');
const [memories, setMemories] = useState('');
const [insideJokes, setInsideJokes] = useState('');
const [sharedInterests, setSharedInterests] = useState('');
const [recentEvents, setRecentEvents] = useState('');
const [generatedMessage, setGeneratedMessage] = useState('');
const [credits, setCredits] = useState(3);
const [isLoading, setIsLoading] = useState(false);
```

## Key Functions

### generateMessage

```javascript
const generateMessage = async () => { ... }
```

**Purpose**: Generates a personalized Christmas message based on user inputs. **Validation**:

-   Checks for available credits
-   Validates required fields (recipient name and relationship) **Returns**: Sets the generated
    message in state and decrements credits

### getToneLabel

```javascript
const getToneLabel = (value) => { ... }
```

**Purpose**: Converts numeric tone value to corresponding label **Parameters**:

-   `value`: Number (0-100) **Returns**: String (Professional, Warm, Playful, or Sentimental)

### handleDownload

```javascript
const handleDownload = () => { ... }
```

**Purpose**: Creates and triggers download of generated message as text file **Output**: Downloads
'christmas-message.txt'

## UI Components

### Message Style Selection

-   Four style options: Formal, Casual, Funny, Heartfelt
-   Implemented using Chakra UI Cards with visual feedback

### Tone Slider

-   Range: 0-100
-   Maps to four tone categories
-   Visual slider implementation using Chakra UI Slider

### Input Fields

-   Recipient Name (Input)
-   Relationship (Select)
-   Special memories (Textarea)
-   Inside jokes (Textarea)
-   Shared interests (Textarea)
-   Recent events (Textarea)

### Action Buttons

-   Generate Message button
-   Download Message button (appears after generation)

## Features

-   Dark/Light mode toggle
-   Credits system
-   Responsive design
-   Error handling with toast notifications
-   Message preview
-   Download functionality

## Usage Example

```jsx
// Import and use in main.jsx
import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
```

## Project Integration

This component is the main application file in a Vite-based React project. It works alongside:

-   `main.jsx`: Application entry point
-   `theme.jsx`: Chakra UI theme customization
-   Other configuration files (.prettierrc, vite.config.js)

## Dependencies

-   React
-   Chakra UI
-   React Icons

## Notes

-   The actual AI message generation is currently mocked
-   Credits system is implemented with a basic counter
-   Supports responsive design for various screen sizes
-   Includes accessibility features through Chakra UI components

This documentation provides a comprehensive overview of the `App.jsx` component and its
functionality within the Christmas Card Message Generator application.
