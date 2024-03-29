// libs
import { useToast } from "@chakra-ui/react"

// utils
import { AlertColorScheme, AlertStatus } from "../utils/enums"

export const useMessage = () => {
  const toast = useToast()

  const showMessage = (
    title: string,
    status: AlertStatus,
    colorScheme: AlertColorScheme,
    description: string | undefined = undefined
  ) => {
    toast({
      position: "top",
      title,
      description,
      status,
      duration: 2000,
      isClosable: true,
      colorScheme,
      variant: "subtle",
    })
  }

  return { showMessage }
}
