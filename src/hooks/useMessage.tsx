// libs
import { Box, Flex, Text, useColorModeValue, useToast } from "@chakra-ui/react"

// utils
import { AlertColorScheme, AlertStatus } from "../utils/enums"

export const useMessage = () => {
  const toast = useToast()
  const toastBg = useColorModeValue("#FFFFFF", "#1A202C")
  const toastBorderColor = useColorModeValue("#E2E8F0", "#2D3748")
  const toastTextColor = useColorModeValue("#1A202C", "#F7FAFC")
  const toastDescriptionColor = useColorModeValue("#4A5568", "#E2E8F0")
  const toastShadow = useColorModeValue(
    "0 12px 32px rgba(15, 23, 42, 0.12)",
    "0 16px 40px rgba(0, 0, 0, 0.35)",
  )

  const accentColors: Record<AlertColorScheme, string> = {
    [AlertColorScheme.Purple]: "#8146E6",
    [AlertColorScheme.Red]: "#E53E3E",
    [AlertColorScheme.Blue]: "#3182CE",
    [AlertColorScheme.Green]: "#38A169",
    [AlertColorScheme.Yellow]: "#D69E2E",
    [AlertColorScheme.Gray]: "#718096",
  }

  const showMessage = (
    title: string,
    status: AlertStatus,
    colorScheme: AlertColorScheme,
    description: string | undefined = undefined
  ) => {
    toast({
      position: "top",
      duration: 2000,
      isClosable: true,
      colorScheme,
      variant: "solid",
      render: ({ onClose }) => (
        <Box
          bg={toastBg}
          color={toastTextColor}
          borderWidth="1px"
          borderColor={toastBorderColor}
          borderLeftWidth="4px"
          borderLeftColor={accentColors[colorScheme]}
          borderRadius="lg"
          boxShadow={toastShadow}
          px={4}
          py={3}
        >
          <Flex align="start" justify="space-between" gap={3}>
            <Box>
              <Text fontWeight="bold">{title}</Text>
              {description && (
                <Text mt={1} fontSize="sm" color={toastDescriptionColor}>
                  {description}
                </Text>
              )}
            </Box>
            <Box
              as="button"
              type="button"
              fontSize="sm"
              fontWeight="bold"
              opacity={0.8}
              onClick={onClose}
            >
              ×
            </Box>
          </Flex>
        </Box>
      ),
    })
  }

  return { showMessage }
}
