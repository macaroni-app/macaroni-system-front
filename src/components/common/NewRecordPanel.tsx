import { AddIcon } from "@chakra-ui/icons"
import { Button, Card, CardBody, Flex, HStack, Stack, Text } from "@chakra-ui/react"

import { useCheckRole } from "../../hooks/useCheckRole"

interface Props {
  noRecords: number
  buttonLabel: string
  title: string
  handleAddRecord: () => void
  roles: number[]
  showBulkBtn?: boolean
  handleAddBulkRecords?: () => void
}

const NewRecordPanel = ({
  noRecords,
  buttonLabel,
  title,
  handleAddRecord,
  roles,
  showBulkBtn,
  handleAddBulkRecords,
}: Props) => {
  const { checkRole } = useCheckRole()

  return (
    <Card bgColor={"#373E68"} variant="filled" mt={5} mb={3}>
      <CardBody>
        <Stack spacing={4}>
          <Text
            color={"white"}
            fontWeight={"bold"}
            fontSize={{ base: "2xl", md: "medium" }}
            lineHeight={{ base: "short", md: "normal" }}
          >
            {noRecords} {title}
          </Text>
          {checkRole(roles) && (
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={3}
              align={{ base: "stretch", md: "center" }}
              justify={{ base: "stretch", md: "flex-end" }}
            >
              {showBulkBtn !== undefined &&
                showBulkBtn &&
                handleAddBulkRecords !== undefined && (
                  <Button
                    onClick={() => handleAddBulkRecords()}
                    colorScheme="blue"
                    size={{ base: "md", md: "md" }}
                    width={{ base: "100%", md: "auto" }}
                    leftIcon={<AddIcon boxSize={3} />}
                  >
                    Masivo
                  </Button>
                )}
              <Button
                onClick={() => handleAddRecord()}
                colorScheme="purple"
                variant="solid"
                size={{ base: "md", md: "md" }}
                width={{ base: "100%", md: "auto" }}
                leftIcon={<AddIcon boxSize={3} />}
              >
                {buttonLabel}
              </Button>
            </Stack>
          )}
        </Stack>
      </CardBody>
    </Card>
  )
}

export default NewRecordPanel
