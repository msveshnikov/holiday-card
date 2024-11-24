import { useState, useEffect } from 'react';
import {
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
    IconButton,
    Image,
    Tooltip,
    Progress,
    FormControl,
    FormLabel,
    Switch,
    Grid,
    GridItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Link
} from '@chakra-ui/react';
import { FaShareAlt, FaCrown, FaGift, FaCalendarAlt, FaLeaf } from 'react-icons/fa';
import ReactGA from 'react-ga4';
import { useTranslation } from 'react-i18next';
import theme from './theme.js';

export const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://holiday.autocode.work/api';

function App() {
    const { t } = useTranslation();
    const [messageStyle, setMessageStyle] = useState('formal');
    const [tone, setTone] = useState(50);
    const [recipientName, setRecipientName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [memories, setMemories] = useState('');
    const [insideJokes, setInsideJokes] = useState('');
    const [sharedInterests, setSharedInterests] = useState('');
    const [recentEvents, setRecentEvents] = useState('');
    const [customAdditions, setCustomAdditions] = useState('');
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
    const [messageHistory, setMessageHistory] = useState([]);
    const [selectedHoliday, setSelectedHoliday] = useState('christmas');
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

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
    }, []);

    useEffect(() => {
        localStorage.setItem('credits', credits);
    }, [credits]);

    useEffect(() => {
        localStorage.setItem('messageHistory', JSON.stringify(messageHistory));
    }, [messageHistory]);

    const styles = [
        { id: 'formal', name: t('formal'), icon: '🎩' },
        { id: 'casual', name: t('casual'), icon: '😊' },
        { id: 'funny', name: t('funny'), icon: '😂' },
        { id: 'heartfelt', name: t('heartfelt'), icon: '❤️' }
    ];

    const fonts = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];

    const toneLabels = {
        0: t('professional'),
        33: t('warm'),
        66: t('playful'),
        100: t('sentimental')
    };

    const backgroundImages = [
        'https://plus.unsplash.com/premium_photo-1661766896016-16e307246d5d?q=80&w=570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1480930700499-dc44aa7cb2cf?q=80&w=570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1483373018724-770a096812ff?q=80&w=570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1461010083959-8a5727311252?q=80&w=570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ];

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
            const prompt = `Create a ${messageStyle} ${selectedHoliday} message with a ${getToneLabel(
                tone
            )} tone for my ${relationship} named ${recipientName}.${
                memories ? ` Include these memories: ${memories}.` : ''
            }${insideJokes ? ` Reference these inside jokes: ${insideJokes}.` : ''}${
                sharedInterests ? ` Mention our shared interests in: ${sharedInterests}.` : ''
            }${recentEvents ? ` Acknowledge these recent events: ${recentEvents}.` : ''}${
                customAdditions ? ` Add this custom message: ${customAdditions}.` : ''
            }${useEmojis ? ' Include appropriate emojis.' : ''} 
            Language:${(navigator.languages && navigator.languages[0]) || navigator.language}
            Respond with message only, without header`;

            const response = await fetch(`${API_URL}/generate-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    input: prompt
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate message');
            }

            const data = await response.json();
            setGeneratedMessage(data.textResponse);
            setCredits(credits - 1);
            setProgress(100);
            setMessageHistory([...messageHistory, data.textResponse]);
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
        element.download = `${selectedHoliday.toLowerCase()}-message.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
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
                toast({
                    title: t('errorSharingMessage'),
                    status: 'error',
                    duration: 2000
                });
            }
        } else {
            navigator.clipboard.writeText(generatedMessage);
            toast({
                title: t('messageCopiedToClipboard'),
                status: 'success',
                duration: 2000
            });
        }
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
        <Box minHeight="100vh" bg={theme.colors.background}>
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8}>
                    <Box textAlign="center" position="relative" width="100%">
                        <Text fontSize="3xl" fontWeight="bold" color={theme.colors.primary}>
                            {t('cardGenerator', { holiday: t('holidays.' + selectedHoliday) })}
                        </Text>
                        <Badge colorScheme="green" ml={2}>
                            {t('credits')}: {credits}
                        </Badge>
                        <Tooltip label={t('claimDailyReward')}>
                            <IconButton
                                aria-label={t('claimDailyReward')}
                                icon={<FaGift />}
                                ml={2}
                                onClick={handleDailyReward}
                                colorScheme="pink"
                            />
                        </Tooltip>
                        <Tooltip label={t('upgradeToPremium')}>
                            <IconButton
                                aria-label={t('upgradeToPremium')}
                                icon={<FaCrown />}
                                ml={2}
                                colorScheme="yellow"
                            />
                        </Tooltip>
                        <Tooltip label={t('selectHoliday')}>
                            <IconButton
                                aria-label={t('selectHoliday')}
                                icon={<FaCalendarAlt />}
                                ml={2}
                                onClick={onOpen}
                                colorScheme="blue"
                            />
                        </Tooltip>
                        <Tooltip label={t('ecoFriendly')}>
                            <IconButton
                                aria-label={t('ecoFriendly')}
                                icon={<FaLeaf />}
                                ml={2}
                                colorScheme="green"
                            />
                        </Tooltip>
                    </Box>

                    <SimpleGrid columns={[1, 2, 3]} spacing={4} width="100%">
                        <FormControl>
                            <FormLabel>{t('fontSize')}</FormLabel>
                            <Slider value={fontSize} min={12} max={24} onChange={setFontSize}>
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

                    <SimpleGrid columns={[2, 2, 4]} spacing={4} width="100%">
                        {styles.map((style) => (
                            <Card
                                key={style.id}
                                cursor="pointer"
                                bg={messageStyle === style.id ? 'green.100' : 'white'}
                                onClick={() => setMessageStyle(style.id)}
                                transition="transform 0.2s"
                                _hover={{ transform: 'scale(1.05)' }}
                            >
                                <CardBody textAlign="center">
                                    <Text fontSize="2xl">{style.icon}</Text>
                                    <Text>{style.name}</Text>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>

                    <Box width="100%">
                        <Text mb={2}>{t('backgroundImage')}:</Text>
                        <SimpleGrid columns={[2, 2, 4]} spacing={4}>
                            {backgroundImages.map((image, index) => (
                                <Image
                                    key={index}
                                    src={image}
                                    alt={`${t('background')} ${index + 1}`}
                                    cursor="pointer"
                                    borderRadius="md"
                                    border={selectedImage === image ? '2px solid green' : 'none'}
                                    onClick={() => setSelectedImage(image)}
                                    height="200px"
                                    objectFit="cover"
                                    transition="transform 0.2s"
                                    _hover={{ transform: 'scale(1.05)' }}
                                />
                            ))}
                        </SimpleGrid>
                    </Box>

                    <Box width="100%">
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

                    <Grid templateColumns={['1fr', '1fr', 'repeat(2, 1fr)']} gap={4} width="100%">
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel>{t('recipientName')}</FormLabel>
                                <Input
                                    placeholder={t('recipientName')}
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                />
                            </FormControl>
                        </GridItem>
                        <GridItem>
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
                        </GridItem>
                        <GridItem colSpan={[1, 1, 2]}>
                            <Textarea
                                placeholder={t('specialMemories')}
                                value={memories}
                                onChange={(e) => setMemories(e.target.value)}
                            />
                        </GridItem>
                        <GridItem colSpan={[1, 1, 2]}>
                            <Textarea
                                placeholder={t('insideJokes')}
                                value={insideJokes}
                                onChange={(e) => setInsideJokes(e.target.value)}
                            />
                        </GridItem>
                        <GridItem>
                            <Textarea
                                placeholder={t('sharedInterests')}
                                value={sharedInterests}
                                onChange={(e) => setSharedInterests(e.target.value)}
                            />
                        </GridItem>
                        <GridItem>
                            <Textarea
                                placeholder={t('recentEvents')}
                                value={recentEvents}
                                onChange={(e) => setRecentEvents(e.target.value)}
                            />
                        </GridItem>
                        <GridItem colSpan={[1, 1, 2]}>
                            <Textarea
                                placeholder={t('customMessageAdditions')}
                                value={customAdditions}
                                onChange={(e) => setCustomAdditions(e.target.value)}
                            />
                        </GridItem>
                        <GridItem colSpan={[1, 1, 2]}>
                            <FormControl display="flex" alignItems="center">
                                <FormLabel mb="0">{t('useEmojis')}</FormLabel>
                                <Switch
                                    isChecked={useEmojis}
                                    onChange={() => setUseEmojis(!useEmojis)}
                                />
                            </FormControl>
                        </GridItem>
                    </Grid>

                    <Button
                        colorScheme="green"
                        isLoading={isLoading}
                        onClick={generateMessage}
                        width="100%"
                        size="lg"
                    >
                        {t('generateMessage')}
                    </Button>

                    {isLoading && <Progress value={progress} width="100%" colorScheme="green" />}

                    {generatedMessage && (
                        <Card width="100%">
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
                                <SimpleGrid columns={[1, 2]} spacing={4} mt={4}>
                                    <Button
                                        leftIcon={<FaShareAlt />}
                                        colorScheme="green"
                                        onClick={handleShare}
                                    >
                                        {t('shareMessage')}
                                    </Button>
                                    <Button colorScheme="blue" onClick={handleDownload}>
                                        {t('download')}
                                    </Button>
                                </SimpleGrid>
                            </CardBody>
                        </Card>
                    )}

                    {messageHistory.length > 0 && (
                        <Box width="100%">
                            <Text fontSize="xl" fontWeight="bold" mb={2}>
                                {t('messageHistory')}
                            </Text>
                            <VStack spacing={2} align="stretch">
                                {messageHistory.map((message, index) => (
                                    <Card key={index}>
                                        <CardBody>
                                            <Text noOfLines={2}>{message}</Text>
                                        </CardBody>
                                    </Card>
                                ))}
                            </VStack>
                        </Box>
                    )}

                    <Box width="100%" textAlign="center">
                        <Text fontSize="sm" color="gray.500">
                            {t('ecoFriendlyMessage')}{' '}
                            <Link
                                color="green.500"
                                href="https://holidaycard.shop/landing.html"
                                isExternal
                            >
                                {t('learnMore')}
                            </Link>
                        </Text>
                    </Box>
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
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            {t('close')}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default App;
