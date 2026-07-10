import { Card, CardBody, Flex, Text, useColorModeValue } from "@chakra-ui/react"

interface Props {
  title: string
  amount: number
  size: number
  fontColor: string
}

const SimpleBoard = ({ title, amount, size, fontColor }: Props) => {
  const titleColor = useColorModeValue("gray.600", "gray.400")
  const valueColor = useColorModeValue(fontColor || "gray.900", "white")

  return (
    <Card variant="outline">
      <CardBody>
        <Flex direction={"column"}>
          <Text color={titleColor}>{title}</Text>
          <Text fontSize={"2xl"} as="b" color={valueColor}>
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
