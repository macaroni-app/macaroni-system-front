import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react"

import HeaderMenu from "./HeaderMenu"

const Header = (): JSX.Element => {
  return (
    <Box
      borderBottom={"1px"}
      borderBottomColor={useColorModeValue("gray.200", "whiteAlpha.200")}
      bg={useColorModeValue("white", "gray.900")}
      padding={2}
      pb={{ base: 2, md: 3 }}
    >
      <Flex
        flex={{ base: 1 }}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={{ base: 0, md: 2 }}
      >
        <Flex gap={1} placeItems={"center"}>
          <Text
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
          >
            MACARONI
          </Text>
        </Flex>
      </Flex>

      <HeaderMenu />
    </Box>
  )
}

export default Header
