import { AddIcon } from "@chakra-ui/icons"
import { Card, CardBody, Flex, Text, Spacer, Button } from "@chakra-ui/react"

import { useCheckRole } from "../../hooks/useCheckRole"

interface Props {
  noRecords: number
  buttonLabel: string
  title: string
  handleAddRecord: () => void
  roles: number[]
}

const NewRecordPanel = ({
  noRecords,
  buttonLabel,
  title,
  handleAddRecord,
  roles,
}: Props) => {
  const { checkRole } = useCheckRole()

  return (
    <Card bgColor={"#373E68"} variant="filled" mt={5} mb={3}>
      <CardBody>
        <Flex placeItems={"center"}>
          <Text
            color={"white"}
            fontWeight={"bold"}
            fontSize={{ base: "small", md: "medium" }}
          >
            {noRecords} {title}
          </Text>
          <Spacer />
          {checkRole(roles) && (
            <Button
              onClick={() => handleAddRecord()}
              colorScheme="purple"
              variant="solid"
              size={{ base: "sm", md: "md" }}
            >
              <AddIcon boxSize={3} me={2} />
              {buttonLabel}
            </Button>
          )}
        </Flex>
      </CardBody>
    </Card>
  )
}

export default NewRecordPanel
