import { Card, CardBody, Alert, AlertIcon } from "@chakra-ui/react"

const Unauthorized = () => {
  return (
    <Card variant="outline">
      <CardBody>
        <Alert colorScheme="purple" status="success">
          <AlertIcon />
          No tenes acceso
        </Alert>
      </CardBody>
    </Card>
  )
}

export default Unauthorized
