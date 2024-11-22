import { useState } from 'react';
import {
    ChakraProvider,
    Box,
    VStack,
    Container,
    Text,
    Select,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Input,
    Textarea,
    Button,
    useToast,
    Badge,
    Card,
    CardBody,
    SimpleGrid
} from '@chakra-ui/react';

function App() {
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

    const toast = useToast();

    const styles = [
        { id: 'formal', name: 'Formal', icon: '🎩' },
        { id: 'casual', name: 'Casual', icon: '😊' },
        { id: 'funny', name: 'Funny', icon: '😂' },
        { id: 'heartfelt', name: 'Heartfelt', icon: '❤️' }
    ];

    const generateMessage = async () => {
        if (credits <= 0) {
            toast({
                title: 'No credits remaining',
                description: 'Please upgrade your plan to generate more messages',
                status: 'error',
                duration: 3000
            });
            return;
        }

        setIsLoading(true);
        try {
            // TODO: Implement OpenAI API call
            const message = `Dear ${recipientName}, Happy Holidays! [Generated message would go here]`;
            setGeneratedMessage(message);
            setCredits(credits - 1);
        } catch (error) {
            toast({
                title: 'Error generating message',
                description: error.message,
                status: 'error',
                duration: 3000
            });
        }
        setIsLoading(false);
    };

    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob([generatedMessage], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'christmas-message.txt';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <ChakraProvider>
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8}>
                    <Box textAlign="center">
                        <Text fontSize="3xl" fontWeight="bold">
                            AI Christmas Card Message Generator 🎄
                        </Text>
                        <Badge colorScheme="green">Credits remaining: {credits}</Badge>
                    </Box>

                    <SimpleGrid columns={[1, 2, 4]} spacing={4} width="100%">
                        {styles.map((style) => (
                            <Card
                                key={style.id}
                                cursor="pointer"
                                bg={messageStyle === style.id ? 'green.100' : 'white'}
                                onClick={() => setMessageStyle(style.id)}
                            >
                                <CardBody textAlign="center">
                                    <Text fontSize="2xl">{style.icon}</Text>
                                    <Text>{style.name}</Text>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>

                    <Box width="100%">
                        <Text mb={2}>Tone</Text>
                        <Slider
                            value={tone}
                            onChange={setTone}
                            min={0}
                            max={100}
                            aria-label="tone-slider"
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </Box>

                    <VStack width="100%" spacing={4}>
                        <Input
                            placeholder="Recipient Name"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                        />
                        <Select
                            placeholder="Relationship"
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                        >
                            <option value="family">Family</option>
                            <option value="friend">Friend</option>
                            <option value="colleague">Colleague</option>
                            <option value="other">Other</option>
                        </Select>
                        <Textarea
                            placeholder="Special memories"
                            value={memories}
                            onChange={(e) => setMemories(e.target.value)}
                        />
                        <Textarea
                            placeholder="Inside jokes"
                            value={insideJokes}
                            onChange={(e) => setInsideJokes(e.target.value)}
                        />
                        <Textarea
                            placeholder="Shared interests"
                            value={sharedInterests}
                            onChange={(e) => setSharedInterests(e.target.value)}
                        />
                        <Textarea
                            placeholder="Recent events"
                            value={recentEvents}
                            onChange={(e) => setRecentEvents(e.target.value)}
                        />
                    </VStack>

                    <Button
                        colorScheme="green"
                        isLoading={isLoading}
                        onClick={generateMessage}
                        width="100%"
                    >
                        Generate Message
                    </Button>

                    {generatedMessage && (
                        <Card width="100%">
                            <CardBody>
                                <Text whiteSpace="pre-wrap">{generatedMessage}</Text>
                                <Button mt={4} colorScheme="blue" onClick={handleDownload}>
                                    Download Message
                                </Button>
                            </CardBody>
                        </Card>
                    )}
                </VStack>
            </Container>
        </ChakraProvider>
    );
}

export default App;
