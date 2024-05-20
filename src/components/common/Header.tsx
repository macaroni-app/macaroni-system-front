import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react"

import HeaderMenu from "./HeaderMenu"

const Header = (): JSX.Element => {
  return (
    <Box>
      <Flex
        flex={{ base: 1 }}
        justifyContent={"space-between"}
        borderBottom={"1px"}
        borderBottomColor={"#E2E8F0"}
        padding={2}
      >
        <Flex gap={1} placeItems={"center"}>
          <Text
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
          >
            MACARONI
          </Text>
        </Flex>

        <Flex ml={10} placeItems={"center"}>
          <HeaderMenu />
        </Flex>
      </Flex>
    </Box>
  )
}

export default Header
