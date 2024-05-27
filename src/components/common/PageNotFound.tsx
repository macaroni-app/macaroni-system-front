import { Card, CardBody, Text, Button, Flex } from "@chakra-ui/react"

import { useNavigate } from "react-router-dom"

const PageNotFound = () => {
  const navigate = useNavigate()

  const goToHome = () => {
    navigate("/")
  }

  return (
    <>
      <Card variant="unstyled" mt={5} mb={3}>
        <CardBody>
          <Flex
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Text textAlign={"center"} fontWeight={"bold"} fontSize={"8xl"}>
              404
            </Text>
            <Text textAlign={"center"}>Opps... Página no encontrada</Text>
            <Button
              variant={"ghost"}
              colorScheme="purple"
              onClick={() => goToHome()}
            >
              Ir al inicio
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </>
  )
}

export default PageNotFound
