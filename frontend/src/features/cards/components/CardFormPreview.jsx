import { Box, Flex, Text, Image, Stack, VStack } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { API_BASE_URL } from "@constants/api";

/**
 * CardFormPreview Component
 *
 * Real-time card preview for the card creation/edit form.
 * Displays game-specific stats like combat_power, resilience, max_occurrence.
 * Updates live as the user fills out the form.
 *
 * @param {Object} formData - The form data from React Hook Form watch()
 * @param {boolean} showWrapper - Whether to show the sticky wrapper and "Live Preview" heading (default: true)
 */
export const CardFormPreview = ({ formData, showWrapper = true }) => {
  const {
    name = "Card Name",
    archetype,
    type,
    faction,
    cost = 0,
    combat_power = 0,
    resilience = 0,
    description = "",
    effects = [],
    bonuses = [],
    illustration,
    max_occurrence = 1,
  } = formData;

  // Color mode values
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const backgroundColor = useColorModeValue("white", "gray.900");

  // Get theme color from type's color field, fallback to default blue
  const themeColor = type?.color || "#4299E1";
  const defaultBorder = themeColor;

  // Get type icon URL from the type's icon_path
  const getTypeIconUrl = () => {
    if (type?.icon_path) {
      const filename = type.icon_path.split("/").pop();
      return `${API_BASE_URL}/types/icon/${filename}`;
    }
    return null;
  };

  const typeIconUrl = getTypeIconUrl();

  // Inner card component
  // Standard card size: 63.5mm x 88.9mm (2.5" x 3.5")
  // Aspect ratio: 1:1.4
  // Using 300px width for good screen display
  const cardElement = (
    <Box
      w="300px"
      h="420px"
      color={textColor}
      borderRadius="lg"
      borderWidth="4px"
      borderColor={defaultBorder}
      overflow="hidden"
      boxShadow="2xl"
      bg={backgroundColor}
      transition="transform 0.2s ease"
      _hover={{ transform: "scale(1.8)" }}
      position="relative"
    >
      {/* ===== Illustration + All Overlays ===== */}
      <Box position="absolute" inset="0" overflow="hidden">
        {/* --- Background image --- */}
        {illustration?.url ? (
          <>
            <Image
              src={`http://localhost:8000${illustration.url}`}
              alt={name || "Card"}
              objectFit="cover"
              w="100%"
              h="100%"
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

        {/* --- Top bar overlay --- */}
        <Box position="absolute" top="8px" left="8px" right="8px" zIndex={3}>
          <Flex
            bgColor="blackAlpha.700"
            align="center"
            justify="space-between"
            px={1.5}
            py={0.5}
            borderRadius="full"
            border="1px solid"
            borderColor={defaultBorder}
            backdropFilter="blur(6px)"
          >
            {/* Left side: type icon */}
            <Flex align="center" gap={1}>
              <Flex
                align="center"
                justify="center"
                boxSize="24px"
                overflow="hidden"
              >
                {typeIconUrl ? (
                  <Image
                    src={typeIconUrl}
                    alt={type?.name || "Type icon"}
                    boxSize="full"
                    objectFit="contain"
                  />
                ) : (
                  <Text fontSize="md">?</Text>
                )}
              </Flex>
            </Flex>

            {/* Center: card name */}
            <Text
              flex="1"
              textAlign="center"
              fontSize="md"
              fontWeight="bold"
              color="white"
              textShadow="0 0 4px rgba(0,0,0,0.8)"
              mx={2}
              noOfLines={1}
            >
              {name}
            </Text>

            {/* Right: cost */}
            <Flex
              align="center"
              justify="center"
              boxSize="28px"
              fontWeight="extrabold"
              fontSize="md"
              color="black"
              position="relative"
            >
              <Image
                src="/src/resources/connaissance.svg"
                alt="Cost background"
                position="absolute"
                boxSize="full"
                objectFit="contain"
              />
              <Text
                position="relative"
                zIndex={1}
                fontWeight="extrabold"
                WebkitTextStroke="1px white"
              >
                {cost ?? "—"}
              </Text>
            </Flex>
          </Flex>
        </Box>

        {/* --- Bottom stacked overlays (Faction, Effects, Description, Footer) --- */}
        <VStack position="absolute" bottom={0} zIndex={2}>
          {/* Faction / Bonuses */}
          <Flex w="100%" align={"left"} gap={1} px={2}>
            {/* Faction bubble - only show if defined */}
            {faction && (
              <Box
                border="1px solid"
                borderColor={defaultBorder}
                bg="blackAlpha.700"
                backdropFilter="blur(8px)"
                borderRadius="full"
                px={2}
                py={0.5}
              >
                <Text
                  fontSize="2xs"
                  fontWeight="bold"
                  color="white"
                  textTransform="uppercase"
                >
                  {faction.name}
                </Text>
              </Box>
            )}

            {/* Power - only show if defined */}
            {combat_power && (
              <Flex
                align="center"
                justify="center"
                gap={1}
                border="1px solid"
                borderColor={defaultBorder}
                bg="blackAlpha.700"
                backdropFilter="blur(8px)"
                borderRadius="full"
                px={2}
                height={6}
              >
                <Image
                  src="/src/resources/puissance.svg"
                  alt="combat power icon"
                  height="100%"
                  width="auto"
                  objectFit="contain"
                />
                <Text
                  fontSize="2xs"
                  fontWeight="bold"
                  color="white"
                  textTransform="uppercase"
                >
                  {combat_power}
                </Text>
              </Flex>
            )}

            {/* Bonuses bubbles - only show if defined */}
            {bonuses.length > 0 &&
              bonuses.map((bonus) => (
                <Box
                  key={bonus.id}
                  border="1px solid"
                  borderColor={defaultBorder}
                  bg="blackAlpha.700"
                  backdropFilter="blur(8px)"
                  borderRadius="full"
                  px={2}
                  py={0.5}
                >
                  <Text fontSize="2xs" fontWeight="medium" color="white">
                    {bonus.description}
                  </Text>
                </Box>
              ))}
          </Flex>
          <Box
            border="1px solid"
            borderRadius="20px"
            borderColor={defaultBorder}
            bg="blackAlpha.800"
            opacity={0.9}
          >
            {/* Effects */}
            {effects.length > 0 && (
              <Box px={4} py={1.5}>
                <Stack gap={1.5}>
                  {effects.map((effect) => (
                    <Box key={effect.id}>
                      <Text fontSize="2xs" fontWeight="bold" color="white">
                        [Effect] {effect.name}
                      </Text>
                      <Text fontSize="2xs" color="whiteAlpha.900">
                        {effect.description}
                      </Text>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* ===== Description ===== */}
            {description && (
              <Box w="100%" position="relative" overflow="hidden">
                {/* Inner transparent content area */}
                <Box
                  position="relative"
                  opacity={0.9}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={defaultBorder}
                  mx={4}
                  px={4}
                  py={1.5}
                  bgGradient="to-br"
                  gradientFrom={`${defaultBorder}10`}
                  gradientTo={defaultBorder}
                >
                  <Text
                    fontSize="2xs"
                    color="whiteAlpha.900"
                    fontStyle="italic"
                    lineHeight="1.6"
                  >
                    {description}
                  </Text>
                </Box>
              </Box>
            )}

            {/* Footer */}
            <Flex
              px={5}
              align="center"
              justify="space-between"
              fontSize="2xs"
              color="whiteAlpha.900"
            >
              <Text>{type?.name || "—"}</Text>
              <Text>{archetype?.name || "—"}</Text>
              <Text fontSize={"4xs"}>Ascendance TCG</Text>
            </Flex>
          </Box>
        </VStack>
      </Box>
    </Box>
  );

  // Return with or without wrapper based on showWrapper prop
  if (!showWrapper) {
    return cardElement;
  }

  return (
    <Box position="sticky" top={4}>
      <Text fontSize="lg" fontWeight="semibold" mb={4}>
        Live Preview
      </Text>
      {cardElement}
    </Box>
  );
};
