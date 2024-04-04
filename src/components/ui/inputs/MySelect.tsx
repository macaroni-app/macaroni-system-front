import {
  UseFormRegister,
  FormState,
  Control,
  Controller,
} from "react-hook-form"

import { FormLabel, FormControl, FormErrorMessage } from "@chakra-ui/react"
import Select, { PropsValue } from "react-select"

import { ICategory } from "../../categories/types"

interface Props {
  register: UseFormRegister<any>
  formState: FormState<any>
  field: string
  placeholder: string
  label: string
  isDisabled?: boolean
  isRequired?: boolean
  control: Control<any, any>
  data?: ICategory[]
}

type Option = {
  value: string
  label: string
}

const MySelect = (props: Props) => {
  const { formState, field, placeholder, label, data, control, isRequired } =
    props

  const options: PropsValue<any> = data?.map((model) => {
    // if (model.client) {
    //   return {
    //     label: `${model.client.name} - ${model.total}`,
    //     value: model._id,
    //   }
    // }
    return { label: model.name, value: model._id }
  })

  return (
    <FormControl
      isInvalid={
        !!formState.errors[field]?.message && !!formState.touchedFields[field]
      }
    >
      <FormLabel htmlFor={field}>{label}:</FormLabel>
      <Controller
        control={control}
        render={({ field: { onChange, value, name, ref, onBlur } }) => (
          <Select
            ref={ref}
            placeholder={placeholder}
            value={options?.filter((option: Option) => option.value === value)}
            name={name}
            isClearable={true}
            required={isRequired}
            noOptionsMessage={() => "No hay datos"}
            options={options}
            onBlur={onBlur}
            onChange={(selectedOption) => {
              onChange(selectedOption ? selectedOption.value : "")
            }}
          />
        )}
        name={"category"}
      />

      {!!formState.errors[field] && !!formState.touchedFields[field] && (
        <FormErrorMessage>
          {formState?.errors[field]?.message?.toString()}
        </FormErrorMessage>
      )}
    </FormControl>
  )
}

export default MySelect
