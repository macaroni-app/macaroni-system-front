import { UseFormRegister, FormState } from "react-hook-form"

import {
  FormLabel,
  FormControl,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react"

interface Props {
  register: UseFormRegister<any>
  formState: FormState<any>
  field: string
  type: string
  placeholder: string
  label: string
  isDisabled?: boolean
}

const MyInput = (props: Props) => {
  const { register, formState, field, type, placeholder, label, isDisabled } =
    props

  return (
    <FormControl
      isInvalid={
        !!formState.errors[field]?.message && !!formState.touchedFields[field]
      }
    >
      <FormLabel htmlFor={field}>{label}:</FormLabel>
      <Input
        id={field}
        type={type}
        {...register(field, {
          valueAsNumber: type === "number" ? true : false,
        })}
        isDisabled={isDisabled}
        placeholder={placeholder}
        isInvalid={
          !!formState.errors[field] && !!formState.touchedFields[field]
        }
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
