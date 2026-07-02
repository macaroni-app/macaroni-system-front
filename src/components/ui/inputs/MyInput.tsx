import { useState } from "react"
import { UseFormRegister, FormState } from "react-hook-form"

import {
  FormLabel,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react"
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"

interface Props {
  register: UseFormRegister<any>
  formState: FormState<any>
  field: string
  type: string
  placeholder: string
  label: string
  isDisabled?: boolean
  inputId?: string
  autoFocus?: boolean
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onFocus?: () => void
}

const MyInput = (props: Props) => {
  const {
    register,
    formState,
    field,
    type,
    placeholder,
    label,
    isDisabled,
    inputId,
    autoFocus,
    onKeyDown,
    onFocus,
  } = props

  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  if (type === "password") {
    return (
      <FormControl
        isInvalid={
          !!formState.errors[field]?.message && !!formState.touchedFields[field]
        }
      >
        <FormLabel htmlFor={inputId ?? field}>{label}:</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            id={inputId ?? field}
            isDisabled={isDisabled}
            placeholder={placeholder}
            isInvalid={
              !!formState.errors[field] && !!formState.touchedFields[field]
            }
            autoFocus={autoFocus}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            {...register(field)}
          />
          <InputRightElement width="2.5rem">
            <IconButton
              colorScheme="purple"
              variant={"link"}
              icon={show ? <ViewOffIcon /> : <ViewIcon />}
              isRound={true}
              size={"lg"}
              onClick={handleClick}
              aria-label={""}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
    )
  }

  return (
    <FormControl
      isInvalid={
        !!formState.errors[field]?.message && !!formState.touchedFields[field]
      }
    >
      <FormLabel htmlFor={inputId ?? field}>{label}:</FormLabel>
      <Input
        id={inputId ?? field}
        type={type}
        {...register(field, {
          valueAsNumber: type === "number" ? true : false,
        })}
        isDisabled={isDisabled}
        placeholder={placeholder}
        isInvalid={
          !!formState.errors[field] && !!formState.touchedFields[field]
        }
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
      />
      {!!formState.errors[field] && !!formState.touchedFields[field] && (
        <FormErrorMessage>
          {formState?.errors[field]?.message?.toString()}
        </FormErrorMessage>
      )}
    </FormControl>
  )
}

export default MyInput
