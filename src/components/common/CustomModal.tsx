import {
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"
import { IGenericObject } from "./types"

interface ICustomModel extends IGenericObject {
  name?: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  model: ICustomModel
  handleChangeIsActive: (isActive: boolean) => void
  handleDelete: () => void
  isLoading: boolean
  deleteModal: boolean
  modelName: string
}

const CustomModal = ({
  isOpen,
  onClose,
  model,
  handleChangeIsActive,
  handleDelete,
  isLoading,
  deleteModal,
  modelName,
}: Props) => {
  return (
    <Modal
      closeOnOverlayClick={false}
      size={{ base: "xs", md: "lg" }}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        {deleteModal && <ModalHeader>Borrar {modelName}</ModalHeader>}
        {!deleteModal && (
          <ModalHeader>
            {" "}
            {model.isActive
              ? `Desactivar ${modelName}`
              : `Activar ${modelName}`}
          </ModalHeader>
        )}
        <ModalCloseButton />
        <ModalBody>
          {deleteModal && (
            <p>
              ¿Estás seguro de eliminar {modelName}{" "}
              <Text as={"b"}>{model.name}</Text>?
            </p>
          )}
          {!deleteModal && (
            <p>
              ¿Estás seguro de {model.isActive ? "desactivar" : "activar"}{" "}
              {modelName} <Text as={"b"}>{model.name}</Text>?
            </p>
          )}
        </ModalBody>

        <ModalFooter>
          {deleteModal && (
            <Button
              isLoading={isLoading}
              colorScheme="red"
              mr={3}
              onClick={() => handleDelete()}
            >
              Borrar
            </Button>
          )}
          {!deleteModal && (
            <Button
              isLoading={isLoading}
              colorScheme="red"
              mr={3}
              onClick={() =>
                handleChangeIsActive(model.isActive ? false : true)
              }
            >
              {model.isActive ? "Desactivar" : "Activar"}
            </Button>
          )}
          <Button onClick={onClose} variant="ghost">
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CustomModal
