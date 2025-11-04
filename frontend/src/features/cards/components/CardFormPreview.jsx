import {
    Box,
    Flex,
    Text,
    Image,
    Stack,
} from '@chakra-ui/react'
import { useColorModeValue } from '@/components/ui/color-mode'
import { API_BASE_URL } from '@constants/api'

/**
 * CardFormPreview Component
 * 
 * Real-time card preview for the card creation/edit form.
 * Displays game-specific stats like combat_power, resilience, max_occurrence.
 * Updates live as the user fills out the form.
 * 
 * @param {Object} formData - The form data from React Hook Form watch()
 */
export const CardFormPreview = ({ formData }) => {
    const {
        name = 'Card Name',
        archetype,
        type,
        faction,
        cost = 0,
        combat_power = 0,
        resilience = 0,
        description = '',
        effects = [],
        bonuses = [],
        illustration,
        max_occurrence = 1,
    } = formData

    // Color mode values
    const textColor = useColorModeValue("gray.800", "whiteAlpha.900")
    const backgroundColor = useColorModeValue("white", "gray.900")

    // Determine theme color based on type or faction
    const getThemeColor = () => {
        if (type?.name) {
            const typeColors = {
                'Warrior': '#E53E3E',
                'Mage': '#9F7AEA',
                'Rogue': '#38B2AC',
                'Priest': '#ECC94B',
                'Ranger': '#48BB78',
                'Paladin': '#F6AD55',
            }
            return typeColors[type.name] || '#4299E1'
        }
        return '#4299E1'
    }

    const borderColor = getThemeColor()
    const defaultBorder = borderColor

    // Get type icon URL from the type's icon_path
    const getTypeIconUrl = () => {
        if (type?.icon_path) {
            const filename = type.icon_path.split('/').pop()
            return `${API_BASE_URL}/types/icon/${filename}`
        }
        return null
    }

    const typeIconUrl = getTypeIconUrl()

    return (
        <Box position="sticky" top={4}>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Live Preview
            </Text>

            <Box
                w="360px"
                color={textColor}
                borderRadius="lg"
                borderWidth="4px"
                borderColor={defaultBorder}
                overflow="hidden"
                boxShadow="2xl"
                bg={backgroundColor}
                transition="transform 0.2s ease"
                _hover={{ transform: "scale(1.02)" }}
                position="relative"
            >
                {/* ===== Top Bar ===== */}
                <Box
                    position="absolute"
                    top="12px"
                    left="12px"
                    right="12px"
                    zIndex="2"
                >
                    <Flex
                        align="center"
                        justify="space-between"
                        px={4}
                        py={2}
                        borderRadius="full"
                        bgGradient="linear(to-r, blackAlpha.700, blackAlpha.800)"
                        backdropFilter="blur(6px)"
                        boxShadow="inset 0 0 6px rgba(255,255,255,0.15)"
                    >
                        {/* === Left side: Type icons === */}
                        <Flex align="center" gap={2}>
                            <Flex
                                align="center"
                                justify="center"
                                bg="whiteAlpha.200"
                                borderRadius="full"
                                boxSize="32px"
                                shadow="0 0 8px rgba(0,0,0,0.4)"
                                overflow="hidden"
                                padding="4px"
                            >
                                {typeIconUrl ? (
                                    <Image
                                        src={typeIconUrl}
                                        alt={type?.name || 'Type icon'}
                                        boxSize="full"
                                        objectFit="contain"
                                    />
                                ) : (
                                    <Text fontSize="xl">⚔️</Text>
                                )}
                            </Flex>

                            {/* Optional secondary icon (e.g. time/day icon) */}
                            <Flex
                                align="center"
                                justify="center"
                                bg="whiteAlpha.200"
                                borderRadius="full"
                                boxSize="28px"
                                fontSize="md"
                            >
                                ⏱️
                            </Flex>
                        </Flex>

                        {/* === Center: Card name === */}
                        <Text
                            flex="1"
                            textAlign="center"
                            fontSize="lg"
                            fontWeight="bold"
                            color="white"
                            textShadow="0 0 4px rgba(0,0,0,0.8)"
                            mx={4}
                            noOfLines={1}
                        >
                            {name || "Unnamed Card"}
                        </Text>

                        {/* === Right: Cost badge === */}
                        <Flex
                            align="center"
                            justify="center"
                            bg="whiteAlpha.300"
                            borderRadius="full"
                            boxSize="38px"
                            fontWeight="extrabold"
                            fontSize="xl"
                            color="white"
                            shadow="0 0 8px rgba(0,0,0,0.6)"
                            border="2px solid"
                            borderColor="whiteAlpha.400"
                        >
                            {cost ?? "—"}
                        </Flex>
                    </Flex>
                </Box>

                {/* ===== Illustration ===== */}
                <Box position="relative" h="240px" bg="gray.700">
                    {illustration?.url ? (
                        <>
                            <Image
                                src={`http://localhost:8000${illustration.url}`}
                                alt={name || "Card"}
                                objectFit="cover"
                                w="100%"
                                h="100%"
                            />
                            <Box
                                position="absolute"
                                inset="0"
                                bgGradient="linear(to-t, blackAlpha.700 10%, transparent 50%)"
                            />
                        </>
                    ) : (
                        <Flex
                            align="center"
                            justify="center"
                            h="100%"
                            direction="column"
                            gap={2}
                            color="gray.500"
                        >
                            <Text fontSize="5xl">🖼️</Text>
                            <Text fontSize="sm">No Illustration</Text>
                        </Flex>
                    )}
                </Box>

                {/* ===== Stats Bar ===== */}
                <Flex
                    bg="blackAlpha.800"
                    px={4}
                    py={3}
                    justify="space-around"
                    align="center"
                    borderTop="1px solid"
                    borderColor="whiteAlpha.200"
                >
                    {[
                        { label: "⚔️ Puissance", value: combat_power },
                        { label: "🛡️ Défense", value: resilience },
                        { label: "📊 Max", value: max_occurrence },
                    ].map(({ label, value }) => (
                        <Flex key={label} direction="column" align="center" gap={1}>
                            <Text fontSize="xs" color="gray.300" textTransform="uppercase">
                                {label}
                            </Text>
                            <Text fontSize="2xl" fontWeight="bold" color={defaultBorder}>
                                {value ?? "-"}
                            </Text>
                        </Flex>
                    ))}
                </Flex>

                {/* ===== Effect Section ===== */}
                {effects.length > 0 && (
                    <Box
                        bg="blackAlpha.800"
                        px={4}
                        py={3}
                        borderTop="1px solid"
                        borderColor="whiteAlpha.200"
                        borderBottomRadius={effects.length && !bonuses.length ? "lg" : "none"}
                    >
                        <Box
                            bg="blackAlpha.600"
                            borderRadius="md"
                            px={3}
                            py={2}
                            border="1px solid"
                            borderColor="whiteAlpha.300"
                        >
                            <Text
                                fontWeight="bold"
                                color={defaultBorder}
                                mb={1}
                                fontSize="sm"
                            >
                                [Effets]
                            </Text>
                            <Stack spacing={1}>
                                {effects.map((effect) => (
                                    <Text key={effect.id} fontSize="sm" color="whiteAlpha.900">
                                        • {effect.description}
                                    </Text>
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                )}

                {/* ===== Bonuses Section ===== */}
                {bonuses.length > 0 && (
                    <Box
                        bg="gray.900"
                        px={4}
                        py={3}
                        borderTop="1px solid"
                        borderColor="whiteAlpha.200"
                    >
                        <Box
                            bg="gray.800"
                            borderRadius="md"
                            px={3}
                            py={2}
                            border="1px solid"
                            borderColor="whiteAlpha.300"
                        >
                            <Text
                                fontWeight="bold"
                                color={defaultBorder}
                                mb={2}
                                fontSize="sm"
                            >
                                [Bonus]
                            </Text>
                            <Flex wrap="wrap" gap={2}>
                                {bonuses.map((bonus) => (
                                    <Box
                                        key={bonus.id}
                                        bg="whiteAlpha.200"
                                        color="whiteAlpha.900"
                                        borderRadius="full"
                                        px={3}
                                        py={1}
                                        fontSize="xs"
                                        fontWeight="medium"
                                    >
                                        {bonus.description}
                                    </Box>
                                ))}
                            </Flex>
                        </Box>
                    </Box>
                )}

                {/* ===== Description Section ===== */}
                {description && (
                    <Box
                        bg="gray.800"
                        px={4}
                        py={3}
                        borderTop="1px solid"
                        borderColor="whiteAlpha.200"
                    >
                        <Text 
                            fontSize="xs" 
                            color="gray.300" 
                            fontStyle="italic"
                            lineHeight="1.6"
                        >
                            {description}
                        </Text>
                    </Box>
                )}

                {/* ===== Footer ===== */}
                <Flex
                    bg="blackAlpha.700"
                    px={3}
                    py={2}
                    align="center"
                    justify="space-between"
                    fontSize="xs"
                    color="gray.400"
                    textTransform="uppercase"
                >
                    <Text>{type?.name || "—"}</Text>
                    <Text>{archetype?.name || "Aucun archétype"}</Text>
                    <Text>{faction?.name || "—"}</Text>
                </Flex>
            </Box>
        </Box>
    )
}
