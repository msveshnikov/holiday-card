# App.jsx Documentation

## Overview

This file contains the main React component for the Holiday Card Generator application. It provides
a user interface for generating personalized Christmas messages using various inputs and styling
options. The component integrates with an API to generate messages and manages user credits and
message history.

## Component: App

The `App` component is the root component of the application. It manages the state, user
interactions, and renders the UI for the Holiday Card Generator.

### State Variables

-   `messageStyle`: Controls the style of the message (formal, casual, funny, heartfelt)
-   `tone`: Numeric value representing the tone of the message
-   `recipientName`: Name of the message recipient
-   `relationship`: Relationship to the recipient
-   `memories`, `insideJokes`, `sharedInterests`, `recentEvents`, `customAdditions`: Additional
    context for message generation
-   `generatedMessage`: Stores the generated message
-   `credits`: Number of credits available to the user
-   `isLoading`: Boolean indicating if a message is being generated
-   `selectedImage`: URL of the selected background image
-   `useEmojis`: Boolean to include emojis in the message
-   `progress`: Numeric value for the progress bar during message generation
-   `fontSize`, `fontFamily`, `animation`: Styling options for the generated message
-   `messageHistory`: Array of previously generated messages

### Main Functions

#### generateMessage

Generates a new message based on user inputs.

**Usage:**

```javascript
generateMessage();
```

#### handleDownload

Allows the user to download the generated message as a text file.

**Usage:**

```javascript
handleDownload();
```

#### handleShare

Shares the generated message using the Web Share API or copies it to the clipboard.

**Usage:**

```javascript
handleShare();
```

#### handleDailyReward

Adds a daily reward credit to the user's account.

**Usage:**

```javascript
handleDailyReward();
```

### Helper Functions

-   `getToneLabel`: Converts the numeric tone value to a descriptive label
-   `useEffect` hooks: Manage local storage for credits and message history

### UI Sections

1. Header with title and user credits
2. Styling options (font size, font family, animation)
3. Message style selection
4. Background image selection
5. Tone slider
6. Input fields for recipient details and message context
7. Generate message button
8. Generated message display with sharing and download options
9. Message history display

## Integration with Project

This component is the main interface of the Holiday Card Generator application. It should be
rendered in `src/main.jsx` and uses the theme defined in `src/theme.jsx`. The component interacts
with an API defined by the `API_URL` constant, which should be configured appropriately for the
deployment environment.

## Dependencies

-   React
-   Chakra UI components
-   react-icons
-   Environment variables (VITE_CHAT_TOKEN)

## Usage Example

To use this component in the main application:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </React.StrictMode>
);
```

This will render the Holiday Card Generator application with the appropriate theme and Chakra UI
provider.
