import { Card, CardBody, Flex, Text } from "@chakra-ui/react"

interface Props {
  title: string
  amount: number
  size: number
}

const SimpleBoard = ({ title, amount, size }: Props) => {
  return (
    <Card variant="outline">
      <CardBody>
        <Flex direction={"column"}>
          <Text>{title}</Text>
          <Text fontSize={"2xl"} as="b">
            {amount
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  minimumFractionDigits: 2,
                  currency: "USD",
                }).format(size > 0 ? amount : 0)
              : new Intl.NumberFormat("en-US", {
                  style: "currency",
                  minimumFractionDigits: 2,
                  currency: "USD",
                }).format(0)}
          </Text>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default SimpleBoard
