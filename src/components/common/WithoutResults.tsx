import { Card, CardBody, Alert, AlertIcon } from "@chakra-ui/react"

interface Props {
  text: string
}

const WithoutResults = ({ text }: Props) => {
  return (
    <Card variant="outline">
      <CardBody>
        <Alert colorScheme="purple" status="success">
          <AlertIcon />
          {text}
        </Alert>
      </CardBody>
    </Card>
  )
}

export default WithoutResults
