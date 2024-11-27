import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    VStack,
    HStack,
    Heading,
    Text,
    SimpleGrid,
    Card,
    CardBody,
    Select,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Input,
    Textarea,
    Button,
    IconButton,
    Image,
    Progress,
    FormControl,
    FormLabel,
    Switch,
    Badge,
    Tooltip,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    useDisclosure,
    Link,
    Divider
} from '@chakra-ui/react';
import { FaShareAlt, FaCrown, FaGift, FaCalendarAlt, FaDownload } from 'react-icons/fa';
import ReactGA from 'react-ga4';
import { useTranslation } from 'react-i18next';
import theme from './theme.js';

export const API_URL = import.meta.env.DEV
    ? 'http://localhost:3000/api'
    : 'https://holidaycard.shop/api';

function App() {
    const { t } = useTranslation();
    const [messageStyle, setMessageStyle] = useState('formal');
    const [tone, setTone] = useState(50);
    const [recipientName, setRecipientName] = useState('');
    const [relationship, setRelationship] = useState('familyMember');
    const [memories, setMemories] = useState('');
    const [insideJokes, setInsideJokes] = useState('');
    const [sharedInterests, setSharedInterests] = useState('');
    const [recentEvents, setRecentEvents] = useState('');
    const [customAdditions, setCustomAdditions] = useState('');
    const [generatedMessage, setGeneratedMessage] = useState('');
    const [credits, setCredits] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [useEmojis, setUseEmojis] = useState(true);
    const [progress, setProgress] = useState(0);
    const [fontSize, setFontSize] = useState(16);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [messageHistory, setMessageHistory] = useState([]);
    const [selectedHoliday, setSelectedHoliday] = useState('christmas');
    const [backgroundImages, setBackgroundImages] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    const getRandomRotation = () => {
        return Math.random() * 6 - 3;
    };

    useEffect(() => {
        const savedCredits = localStorage.getItem('credits');
        if (savedCredits) {
            setCredits(parseInt(savedCredits, 10));
        }
        const savedHistory = localStorage.getItem('messageHistory');
        if (savedHistory) {
            setMessageHistory(JSON.parse(savedHistory));
        }
    }, []);

    useEffect(() => {
        ReactGA.initialize('G-8B86H1JDH1');
        ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
        fetchBackgroundImages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchBackgroundImages = async () => {
        const response = await fetch(`${API_URL}/images/${selectedHoliday}`);
        const images = await response.json();
        setBackgroundImages(images.images);
        if (images.images.length > 0) {
            setSelectedImage(images.images[0]);
        }
    };

    useEffect(() => {
        localStorage.setItem('credits', credits);
    }, [credits]);

    useEffect(() => {
        localStorage.setItem('messageHistory', JSON.stringify(messageHistory));
    }, [messageHistory]);

    useEffect(() => {
        fetchBackgroundImages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedHoliday]);

    const generateMessage = async () => {
        if (credits <= 0) {
            toast({
                title: t('noCreditsRemaining'),
                description: t('upgradePrompt'),
                status: 'error',
                duration: 3000
            });
            return;
        }

        if (!recipientName || !relationship) {
            toast({
                title: t('missingInformation'),
                description: t('fillRequiredFields'),
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
            const prompt = buildPrompt();
            const response = await fetch(`${API_URL}/generate-message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: prompt })
            });

            if (!response.ok) throw new Error('Failed to generate message');

            const data = await response.json();
            handleSuccessfulGeneration(data.textResponse);
        } catch (error) {
            handleGenerationError(error);
        } finally {
            clearInterval(progressInterval);
            setIsLoading(false);
        }
    };

    const buildPrompt = () => {
        const language = (navigator.languages && navigator.languages[0]) || navigator.language;
        return `Create a ${messageStyle} ${selectedHoliday} message with a ${getToneLabel(tone)} tone for my ${relationship} named ${recipientName}.
            ${memories ? `Include these memories: ${memories}.` : ''}
            ${insideJokes ? `Reference these inside jokes: ${insideJokes}.` : ''}
            ${sharedInterests ? `Mention our shared interests in: ${sharedInterests}.` : ''}
            ${recentEvents ? `Acknowledge these recent events: ${recentEvents}.` : ''}
            ${customAdditions ? `Add this custom message: ${customAdditions}.` : ''}
            ${useEmojis ? 'Include appropriate emojis.' : ''} 
            Language:${language}
            Respond with message only, without header`;
    };

    const handleSuccessfulGeneration = (message) => {
        setGeneratedMessage(message);
        setCredits(credits - 1);
        setProgress(100);
        setMessageHistory([...messageHistory, message]);
        toast({
            title: t('messageGeneratedSuccess'),
            status: 'success',
            duration: 2000
        });
    };

    const handleGenerationError = (error) => {
        toast({
            title: t('errorGeneratingMessage'),
            description: error.message,
            status: 'error',
            duration: 3000
        });
    };

    const styles = [
        { id: 'formal', name: t('formal'), icon: '🎩' },
        { id: 'casual', name: t('casual'), icon: '😊' },
        { id: 'funny', name: t('funny'), icon: '😂' },
        { id: 'heartfelt', name: t('heartfelt'), icon: '❤️' }
    ];
    const fonts = [
        'Arial',
        'Times New Roman',
        'Courier New',
        'Georgia',
        'Verdana',
        'Helvetica',
        'Roboto',
        'Open Sans',
        'Lato',
        'Montserrat',
        'Playfair Display',
        'Dancing Script',
        'Pacifico',
        'Comic Sans MS',
        'Impact'
    ];
    const toneLabels = {
        0: t('professional'),
        33: t('warm'),
        66: t('playful'),
        100: t('sentimental')
    };

    const getToneLabel = (value) => {
        const thresholds = Object.keys(toneLabels).map(Number);
        const closest = thresholds.reduce((prev, curr) =>
            Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
        );
        return toneLabels[closest];
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${selectedHoliday} Message`,
                    text: generatedMessage
                });
                toast({
                    title: t('sharedSuccessfully'),
                    status: 'success',
                    duration: 2000
                });
            } catch {
                handleClipboardCopy();
            }
        } else {
            handleClipboardCopy();
        }
    };

    const handleClipboardCopy = () => {
        navigator.clipboard.writeText(generatedMessage);
        toast({
            title: t('messageCopiedToClipboard'),
            status: 'success',
            duration: 2000
        });
    };

    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob([generatedMessage], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${selectedHoliday.toLowerCase()}-message.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleDailyReward = () => {
        setCredits((prev) => prev + 1);
        toast({
            title: t('dailyRewardClaimed'),
            description: t('creditAdded'),
            status: 'success',
            duration: 2000
        });
    };

    return (
        <Box minH="100vh" bg={theme.colors.background}>
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8}>
                    {/* Header Section */}
                    <Box w="full" textAlign="center">
                        <Heading color={theme.colors.primary} mb={4}>
                            {t('cardGenerator', { holiday: t('holidays.' + selectedHoliday) })}
                        </Heading>
                        <HStack justify="center" spacing={4}>
                            <Badge colorScheme="green" p={2} fontSize="md">
                                {t('credits')}: {credits}
                            </Badge>
                            <Tooltip label={t('claimDailyReward')}>
                                <IconButton
                                    icon={<FaGift />}
                                    colorScheme="pink"
                                    onClick={handleDailyReward}
                                />
                            </Tooltip>
                            <Tooltip label={t('upgradeToPremium')}>
                                <IconButton icon={<FaCrown />} colorScheme="yellow" />
                            </Tooltip>
                            <Tooltip label={t('selectHoliday')}>
                                <IconButton
                                    icon={<FaCalendarAlt />}
                                    colorScheme="blue"
                                    onClick={onOpen}
                                />
                            </Tooltip>
                        </HStack>
                    </Box>

                    {/* Style Selection */}
                    <Card w="full" variant="elevated">
                        <CardBody>
                            <SimpleGrid columns={[2, 2, 4]} spacing={4}>
                                {styles.map((style) => (
                                    <Card
                                        key={style.id}
                                        cursor="pointer"
                                        bg={messageStyle === style.id ? 'green.100' : 'white'}
                                        onClick={() => setMessageStyle(style.id)}
                                        _hover={{ transform: 'scale(1.05)' }}
                                        transition="all 0.2s"
                                    >
                                        <CardBody textAlign="center">
                                            <Text fontSize="2xl">{style.icon}</Text>
                                            <Text>{style.name}</Text>
                                        </CardBody>
                                    </Card>
                                ))}
                            </SimpleGrid>
                        </CardBody>
                    </Card>

                    {/* Background Images */}
                    <Card w="full">
                        <CardBody>
                            <Text fontSize="lg" mb={4}>
                                {t('backgroundImage')}:
                            </Text>
                            <SimpleGrid columns={[2, 2, 4]} spacing={4}>
                                {backgroundImages?.slice(0, 4)?.map((image, index) => (
                                    <Image
                                        key={index}
                                        src={image}
                                        alt={`Background ${index + 1}`}
                                        cursor="pointer"
                                        borderRadius="md"
                                        border={
                                            selectedImage === image
                                                ? '3px solid green'
                                                : '1px solid gray'
                                        }
                                        onClick={() => setSelectedImage(image)}
                                        h="150px"
                                        objectFit="cover"
                                        _hover={{ transform: 'scale(1.05)' }}
                                        transition="all 0.2s"
                                    />
                                ))}
                            </SimpleGrid>
                        </CardBody>
                    </Card>

                    {/* Message Configuration */}
                    <Card w="full">
                        <CardBody>
                            <SimpleGrid columns={[1, 2]} spacing={6}>
                                <FormControl isRequired>
                                    <FormLabel>{t('recipientName')}</FormLabel>
                                    <Input
                                        value={recipientName}
                                        onChange={(e) => setRecipientName(e.target.value)}
                                        placeholder={t('recipientName')}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>{t('relationship')}</FormLabel>
                                    <Select
                                        value={relationship}
                                        onChange={(e) => setRelationship(e.target.value)}
                                    >
                                        {Object.entries(
                                            t('relationships', { returnObjects: true })
                                        ).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                            </SimpleGrid>

                            <Box mt={6}>
                                <Text mb={2}>
                                    {t('tone')}: {getToneLabel(tone)}
                                </Text>
                                <Slider value={tone} onChange={setTone} min={0} max={100}>
                                    <SliderTrack>
                                        <SliderFilledTrack />
                                    </SliderTrack>
                                    <SliderThumb />
                                </Slider>
                            </Box>

                            <SimpleGrid columns={[1, 1, 2]} spacing={4} mt={6}>
                                <FormControl>
                                    <FormLabel>{t('fontSize')}</FormLabel>
                                    <Slider
                                        value={fontSize}
                                        min={12}
                                        max={24}
                                        onChange={setFontSize}
                                    >
                                        <SliderTrack>
                                            <SliderFilledTrack />
                                        </SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>{t('fontFamily')}</FormLabel>
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

                            <VStack spacing={4} mt={6}>
                                <Textarea
                                    placeholder={t('specialMemories')}
                                    value={memories}
                                    onChange={(e) => setMemories(e.target.value)}
                                />
                                <Textarea
                                    placeholder={t('insideJokes')}
                                    value={insideJokes}
                                    onChange={(e) => setInsideJokes(e.target.value)}
                                />
                                <Textarea
                                    placeholder={t('sharedInterests')}
                                    value={sharedInterests}
                                    onChange={(e) => setSharedInterests(e.target.value)}
                                />
                                <Textarea
                                    placeholder={t('recentEvents')}
                                    value={recentEvents}
                                    onChange={(e) => setRecentEvents(e.target.value)}
                                />
                                <Textarea
                                    placeholder={t('customMessageAdditions')}
                                    value={customAdditions}
                                    onChange={(e) => setCustomAdditions(e.target.value)}
                                />
                            </VStack>

                            <FormControl display="flex" alignItems="center" mt={6}>
                                <FormLabel mb="0">{t('useEmojis')}</FormLabel>
                                <Switch
                                    isChecked={useEmojis}
                                    onChange={() => setUseEmojis(!useEmojis)}
                                />
                            </FormControl>
                        </CardBody>
                    </Card>

                    <Button
                        colorScheme="green"
                        size="lg"
                        width="full"
                        isLoading={isLoading}
                        onClick={generateMessage}
                    >
                        {t('generateMessage')}
                    </Button>

                    {isLoading && <Progress value={progress} width="full" colorScheme="green" />}

                    {/* Generated Message Display */}
                    {generatedMessage && (
                        <Card w="full">
                            <CardBody>
                                <Image
                                    src={selectedImage}
                                    alt={t('holidayBackground')}
                                    mb={4}
                                    borderRadius="md"
                                />
                                <Text
                                    whiteSpace="pre-wrap"
                                    style={{
                                        fontSize: `${fontSize}px`,
                                        fontFamily: fontFamily
                                    }}
                                >
                                    {generatedMessage}
                                </Text>
                                <HStack mt={4} spacing={4}>
                                    <Button
                                        leftIcon={<FaShareAlt />}
                                        colorScheme="green"
                                        flex={1}
                                        onClick={handleShare}
                                    >
                                        {t('shareMessage')}
                                    </Button>
                                    <Button
                                        leftIcon={<FaDownload />}
                                        colorScheme="blue"
                                        flex={1}
                                        onClick={handleDownload}
                                    >
                                        {t('download')}
                                    </Button>
                                </HStack>
                            </CardBody>
                        </Card>
                    )}

                    {messageHistory.length > 0 && (
                        <Card w="full">
                            <CardBody>
                                <Heading size="md" mb={4}>
                                    {t('messageHistory')}
                                </Heading>
                                <SimpleGrid columns={[1, 1, 3]} spacing={4}>
                                    {messageHistory.map((message, index) => (
                                        <Card
                                            key={index}
                                            variant="outline"
                                            style={{
                                                transform: `rotate(${getRandomRotation()}deg)`,
                                                transition: 'transform 0.3s ease'
                                            }}
                                            _hover={{
                                                transform: 'rotate(0deg)'
                                            }}
                                        >
                                            <CardBody>
                                                <Text>{message}</Text>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </SimpleGrid>
                            </CardBody>
                        </Card>
                    )}

                    <Divider />

                    <Text fontSize="sm" color="gray.500" textAlign="center">
                        {t('ecoFriendlyMessage')}{' '}
                        <Link color="green.500" href="https://holidaycard.shop/landing.html">
                            {t('learnMore')}
                        </Link>
                    </Text>
                </VStack>
            </Container>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{t('selectHoliday')}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Select
                            value={selectedHoliday}
                            onChange={(e) => setSelectedHoliday(e.target.value)}
                        >
                            {Object.entries(t('holidays', { returnObjects: true })).map(
                                ([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                )
                            )}
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onClose}>
                            {t('close')}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default App;
