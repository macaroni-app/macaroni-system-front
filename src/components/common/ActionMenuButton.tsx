import { forwardRef } from "react"
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { Flex, IconButton, useColorModeValue } from "@chakra-ui/react"

interface Props {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  ariaLabel?: string
}

const ActionMenuButton = forwardRef<HTMLButtonElement, Props>(
  ({ onClick, ariaLabel = "Acciones" }, ref) => {
    const color = useColorModeValue("gray.600", "gray.100")
    const hoverBg = useColorModeValue("gray.100", "whiteAlpha.120")
    const activeBg = useColorModeValue("gray.200", "whiteAlpha.180")

    return (
      <IconButton
        ref={ref}
        alignSelf="end"
        onClick={onClick}
        variant="ghost"
        color={color}
        size="md"
        minW="36px"
        h="36px"
        borderRadius="12px"
        _hover={{ bg: hoverBg }}
        _active={{ bg: activeBg }}
        icon={
          <Flex gap={1} align="center">
            <AddIcon boxSize="3" />
            <ChevronDownIcon boxSize="4" />
          </Flex>
        }
        aria-label={ariaLabel}
      />
    )
  }
)

ActionMenuButton.displayName = "ActionMenuButton"

export default ActionMenuButton
