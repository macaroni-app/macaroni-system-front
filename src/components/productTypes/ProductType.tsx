import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Text,
  Flex,
  IconButton,
  Popover,
  PopoverTrigger,
  Button,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons";
import { useState } from "react";

import { useDeleteProductType } from "../../hooks/useDeleteProductType";
import { useMessage } from "../../hooks/useMessage";

import { IProductTypeType } from "./types";
import { AlertColorScheme, AlertStatus } from "../../utils/enums";

interface Props {
  productType: IProductTypeType;
}

const ProductType = ({ productType }: Props) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { deleteProductType } = useDeleteProductType();
  const { showMessage } = useMessage();

  const handleEdit = () => {
    navigate(`${productType._id}/edit`);
  };

  const handleDelete = async () => {
    setIsLoading(true);

    if (productType === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red);
      setIsLoading(false);
    }

    let response = undefined;

    if (productType !== undefined && productType._id !== undefined) {
      response = await deleteProductType(productType._id);
    }

    if (response?.isDeleted) {
      showMessage(
        "Tipo de producto eliminado.",
        AlertStatus.Success,
        AlertColorScheme.Purple
      );
      setIsLoading(false);
    }

    if (!response?.isDeleted) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red);
      setIsLoading(false);
    }
    navigate("/productTypes");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <GridItem colSpan={5} mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Text fontSize="xl" align="start">
                  {productType.name}
                </Text>
              </Flex>
            </GridItem>

            <GridItem colSpan={1} colStart={6}>
              <Flex direction="column" gap={2}>
                <Popover placement="bottom-start">
                  <PopoverTrigger>
                    <IconButton
                      alignSelf="end"
                      variant={"link"}
                      colorScheme="blackAlpha"
                      size="md"
                      icon={
                        <>
                          <AddIcon boxSize="3" />
                          <ChevronDownIcon boxSize="4" />
                        </>
                      }
                      aria-label={""}
                    />
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent width="3xs">
                      <PopoverArrow />
                      <PopoverBody p={0}>
                        <VStack spacing={1} align="stretch">
                          <Button
                            onClick={() => handleEdit()}
                            variant={"blue"}
                            colorScheme="blue"
                            justifyContent={"start"}
                            size="md"
                            _hover={{
                              textDecoration: "none",
                              color: "purple",
                              bg: "purple.100",
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            onClick={onOpen}
                            variant={"blue"}
                            colorScheme="blue"
                            justifyContent={"start"}
                            size="md"
                            _hover={{
                              textDecoration: "none",
                              color: "purple",
                              bg: "purple.100",
                            }}
                          >
                            Borrar
                          </Button>
                        </VStack>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </Flex>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
      <Modal
        closeOnOverlayClick={false}
        size={{ base: "xs", md: "lg" }}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Borrar tipo de producto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              ¿Estás seguro de eliminar el tipo de producto{" "}
              <Text as={"b"}>{productType.name}</Text>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              colorScheme="red"
              mr={3}
              onClick={() => handleDelete()}
            >
              Borrar
            </Button>
            <Button onClick={onClose} variant="ghost">
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </GridItem>
  );
};

export default ProductType;
