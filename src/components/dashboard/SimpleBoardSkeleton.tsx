import { Card, CardBody, Skeleton, Stack } from "@chakra-ui/react"
interface Props {
  numberRows?: number
}

const SimpleBoardSkeleton = ({ numberRows }: Props) => {
  const skeletons = new Array(numberRows).fill(0)

  const skeletonList = skeletons.map(() => {
    let key = crypto.randomUUID()
    return <Skeleton key={key} height="15px" />
  })

  return (
    <Card variant="outline">
      <CardBody>
        <Stack>{skeletonList}</Stack>
      </CardBody>
    </Card>
  )
}

export default SimpleBoardSkeleton
