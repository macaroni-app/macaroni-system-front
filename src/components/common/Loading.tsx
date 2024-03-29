import { Grid, GridItem, Card, CardBody, Flex, Spinner } from "@chakra-ui/react"

const Loading = () => {
  return (
    <Grid templateColumns={{ base: "repeat(12, 1fr)" }} mt={5}>
      <GridItem colSpan={{ base: 10, md: 8 }} colStart={{ base: 2, md: 3 }}>
        <Card p={10} mb={3} variant="outline">
          <CardBody>
            <Flex
              height={"400px"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="purple.500"
                size="xl"
              />
            </Flex>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  )
}

export default Loading
