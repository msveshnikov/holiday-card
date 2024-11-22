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
    SimpleGrid,
    Link,
    Icon,
    useColorMode,
    IconButton,
    Image,
    Tooltip,
    Progress,
    Switch,
    FormControl,
    FormLabel
} from '@chakra-ui/react';
import { FaGithub, FaSun, FaMoon, FaShareAlt, FaCrown, FaGift } from 'react-icons/fa';

const API_URL = 'https://allchat.online/api';

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
    const [selectedImage, setSelectedImage] = useState(
        'https://plus.unsplash.com/premium_photo-1661766896016-16e307246d5d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    );
    const [useEmojis, setUseEmojis] = useState(true);
    const [progress, setProgress] = useState(0);
    const [fontSize, setFontSize] = useState(16);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [highContrast, setHighContrast] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const { colorMode, toggleColorMode } = useColorMode();

    const toast = useToast();

    const backgroundImages = [
        'https://plus.unsplash.com/premium_photo-1661766896016-16e307246d5d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1480930700499-dc44aa7cb2cf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1483373018724-770a096812ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1461010083959-8a5727311252?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ];

    const styles = [
        { id: 'formal', name: 'Formal', icon: '🎩' },
        { id: 'casual', name: 'Casual', icon: '😊' },
        { id: 'funny', name: 'Funny', icon: '😂' },
        { id: 'heartfelt', name: 'Heartfelt', icon: '❤️' }
    ];

    const fonts = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];

    const toneLabels = {
        0: 'Professional',
        33: 'Warm',
        66: 'Playful',
        100: 'Sentimental'
    };

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

        if (!recipientName || !relationship) {
            toast({
                title: 'Missing information',
                description: 'Please fill in at least the recipient name and relationship',
                status: 'warning',
                duration: 3000
            });
            return;
        }

        setIsLoading(true);
        setProgress(0);
        const progressInterval = setInterval(() => {
            setProgress((prev) => Math.min(prev + 10, 90));
        }, 500);

        try {
            const token = import.meta.env.VITE_CHAT_TOKEN;
            const prompt = `Create a ${messageStyle} Christmas message with a ${getToneLabel(
                tone
            )} tone for my ${relationship} named ${recipientName}.${
                memories ? ` Include these memories: ${memories}.` : ''
            }${insideJokes ? ` Reference these inside jokes: ${insideJokes}.` : ''}${
                sharedInterests ? ` Mention our shared interests in: ${sharedInterests}.` : ''
            }${recentEvents ? ` Acknowledge these recent events: ${recentEvents}.` : ''}${
                useEmojis ? ' Include appropriate emojis.' : ''
            }`;

            const response = await fetch(`${API_URL}/interact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    input: prompt,
                    lang: (navigator.languages && navigator.languages[0]) || navigator.language,
                    model: 'gpt-4o-mini',
                    customGPT: 'Christmas'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate message');
            }

            const data = await response.json();
            setGeneratedMessage(data.textResponse);
            setCredits(credits - 1);
            setProgress(100);
            toast({
                title: 'Message generated successfully',
                status: 'success',
                duration: 2000
            });
        } catch (error) {
            toast({
                title: 'Error generating message',
                description: error.message,
                status: 'error',
                duration: 3000
            });
        } finally {
            clearInterval(progressInterval);
            setIsLoading(false);
        }
    };

    const getToneLabel = (value) => {
        const thresholds = Object.keys(toneLabels).map(Number);
        const closest = thresholds.reduce((prev, curr) =>
            Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
        );
        return toneLabels[closest];
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

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Christmas Message',
                    text: generatedMessage
                });
                toast({
                    title: 'Shared successfully',
                    status: 'success',
                    duration: 2000
                });
            } catch (error) {
                toast({
                    title: 'Error sharing message',
                    status: 'error',
                    duration: 2000
                });
            }
        } else {
            toast({
                title: 'Sharing not supported',
                description: 'Your browser does not support sharing',
                status: 'warning',
                duration: 2000
            });
        }
    };

    const handleDailyReward = () => {
        setCredits((prev) => prev + 1);
        toast({
            title: 'Daily reward claimed!',
            description: '+1 credit added to your account',
            status: 'success',
            duration: 2000
        });
    };

    return (
        <ChakraProvider>
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8}>
                    <Box textAlign="center" position="relative" width="100%">
                        <IconButton
                            aria-label="Toggle color mode"
                            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                            onClick={toggleColorMode}
                            position="absolute"
                            right="0"
                            top="0"
                        />
                        <Text fontSize="3xl" fontWeight="bold">
                            AI Christmas Card Message Generator 🎄
                        </Text>
                        <Link href="https://github.com/msveshnikov/christmas-autocode" isExternal>
                            <Icon as={FaGithub} boxSize={6} />
                        </Link>
                        <Badge colorScheme="green" ml={2}>
                            Credits remaining: {credits}
                        </Badge>
                        <Tooltip label="Claim daily reward">
                            <IconButton
                                aria-label="Claim daily reward"
                                icon={<FaGift />}
                                ml={2}
                                onClick={handleDailyReward}
                                colorScheme="pink"
                            />
                        </Tooltip>
                        <Tooltip label="Upgrade to Premium">
                            <IconButton
                                aria-label="Upgrade to Premium"
                                icon={<FaCrown />}
                                ml={2}
                                colorScheme="yellow"
                            />
                        </Tooltip>
                    </Box>

                    <Box width="100%">
                        <SimpleGrid columns={[1, 2]} spacing={4}>
                            <FormControl display="flex" alignItems="center">
                                <FormLabel mb="0">High Contrast Mode</FormLabel>
                                <Switch
                                    isChecked={highContrast}
                                    onChange={(e) => setHighContrast(e.target.checked)}
                                />
                            </FormControl>
                            <FormControl display="flex" alignItems="center">
                                <FormLabel mb="0">Reduced Motion</FormLabel>
                                <Switch
                                    isChecked={reducedMotion}
                                    onChange={(e) => setReducedMotion(e.target.checked)}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Font Size</FormLabel>
                                <Slider value={fontSize} min={12} max={24} onChange={setFontSize}>
                                    <SliderTrack>
                                        <SliderFilledTrack />
                                    </SliderTrack>
                                    <SliderThumb />
                                </Slider>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Font Family</FormLabel>
                                <Select
                                    value={fontFamily}
                                    onChange={(e) => setFontFamily(e.target.value)}
                                >
                                    {fonts.map((font) => (
                                        <option key={font} value={font}>
                                            {font}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </SimpleGrid>
                    </Box>

                    <SimpleGrid columns={[1, 2, 4]} spacing={4} width="100%">
                        {styles.map((style) => (
                            <Card
                                key={style.id}
                                cursor="pointer"
                                bg={messageStyle === style.id ? 'green.100' : 'white'}
                                onClick={() => setMessageStyle(style.id)}
                                _hover={{ transform: reducedMotion ? 'none' : 'scale(1.02)' }}
                                transition="transform 0.2s"
                            >
                                <CardBody textAlign="center">
                                    <Text fontSize="2xl">{style.icon}</Text>
                                    <Text>{style.name}</Text>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>

                    <Box width="100%">
                        <Text mb={2}>Background Image:</Text>
                        <SimpleGrid columns={[2, 2, 4]} spacing={4}>
                            {backgroundImages.map((image, index) => (
                                <Image
                                    key={index}
                                    src={image}
                                    alt={`Background ${index + 1}`}
                                    cursor="pointer"
                                    borderRadius="md"
                                    border={selectedImage === image ? '2px solid green' : 'none'}
                                    onClick={() => setSelectedImage(image)}
                                    height="200px"
                                    objectFit="cover"
                                />
                            ))}
                        </SimpleGrid>
                    </Box>

                    <Box width="100%">
                        <Text mb={2}>Tone: {getToneLabel(tone)}</Text>
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
                        <Button
                            size="sm"
                            colorScheme={useEmojis ? 'green' : 'gray'}
                            onClick={() => setUseEmojis(!useEmojis)}
                        >
                            {useEmojis ? 'Emojis: On' : 'Emojis: Off'}
                        </Button>
                    </VStack>

                    <Button
                        colorScheme="green"
                        isLoading={isLoading}
                        onClick={generateMessage}
                        width="100%"
                    >
                        Generate Message
                    </Button>

                    {isLoading && <Progress value={progress} width="100%" colorScheme="green" />}

                    {generatedMessage && (
                        <Card width="100%">
                            <CardBody>
                                <Image
                                    src={selectedImage}
                                    alt="Christmas Background"
                                    mb={4}
                                    borderRadius="md"
                                />
                                <Text
                                    whiteSpace="pre-wrap"
                                    style={{
                                        fontSize: `${fontSize}px`,
                                        fontFamily: fontFamily,
                                        filter: highContrast ? 'contrast(1.5)' : 'none'
                                    }}
                                >
                                    {generatedMessage}
                                </Text>
                                <SimpleGrid columns={[1, 2]} spacing={4} mt={4}>
                                    <Button colorScheme="blue" onClick={handleDownload}>
                                        Download Message
                                    </Button>
                                    <Button
                                        leftIcon={<FaShareAlt />}
                                        colorScheme="green"
                                        onClick={handleShare}
                                    >
                                        Share Message
                                    </Button>
                                </SimpleGrid>
                            </CardBody>
                        </Card>
                    )}
                </VStack>
            </Container>
        </ChakraProvider>
    );
}

export default App;
