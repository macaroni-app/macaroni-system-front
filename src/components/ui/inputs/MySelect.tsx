import {
  UseFormRegister,
  FormState,
  Control,
  Controller,
} from "react-hook-form"

import { FormLabel, FormControl, FormErrorMessage, useColorModeValue } from "@chakra-ui/react"
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
  noOptionsMessage?: string
  objectName?: string
  inputId?: string
  autoFocus?: boolean
  onKeyDown?: (event: React.KeyboardEvent) => void
  onFocus?: () => void
  onValueChange?: (value: string) => void
}

type Option = {
  value: string
  label: string
}

export const useReactSelectStyles = () => {
  const selectBg = useColorModeValue("white", "#1A202C")
  const selectBorder = useColorModeValue("#E2E8F0", "#2A3142")
  const selectBorderHover = useColorModeValue("#CBD5E0", "#4A5568")
  const selectText = useColorModeValue("#1A202C", "#F7FAFC")
  const selectMuted = useColorModeValue("#718096", "#A0AEC0")
  const selectMenuBg = useColorModeValue("white", "#171923")
  const selectOptionHover = useColorModeValue("#F7FAFC", "#222838")
  const selectOptionSelected = useColorModeValue("#E9DBFF", "#4F288D")
  const selectMultiBg = useColorModeValue("#EDF2F7", "#2D3748")
  const selectMultiLabel = useColorModeValue("#2D3748", "#E2E8F0")
  const selectMultiRemoveHover = useColorModeValue("#E2E8F0", "#4A5568")

  return {
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: selectBg,
      borderColor: state.isFocused ? "#8146E6" : selectBorder,
      boxShadow: state.isFocused ? "0 0 0 1px #8146E6" : "none",
      minHeight: 40,
      "&:hover": {
        borderColor: state.isFocused ? "#8146E6" : selectBorderHover,
      },
    }),
    valueContainer: (base: any) => ({
      ...base,
      backgroundColor: selectBg,
    }),
    singleValue: (base: any) => ({
      ...base,
      color: selectText,
    }),
    input: (base: any) => ({
      ...base,
      color: selectText,
    }),
    placeholder: (base: any) => ({
      ...base,
      color: selectMuted,
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: selectMenuBg,
      border: `1px solid ${selectBorder}`,
      overflow: "hidden",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? selectOptionSelected
        : state.isFocused
          ? selectOptionHover
          : "transparent",
      color: selectText,
      cursor: "pointer",
    }),
    indicatorSeparator: (base: any) => ({
      ...base,
      backgroundColor: selectBorder,
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: selectMuted,
    }),
    clearIndicator: (base: any) => ({
      ...base,
      color: selectMuted,
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: selectMultiBg,
      borderRadius: 8,
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: selectMultiLabel,
      fontWeight: 600,
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: selectMultiLabel,
      ":hover": {
        backgroundColor: selectMultiRemoveHover,
        color: selectText,
      },
    }),
  }
}

const MySelect = (props: Props) => {
  const {
    formState,
    field,
    placeholder,
    label,
    data,
    control,
    isDisabled,
    isRequired,
    noOptionsMessage,
    objectName,
    inputId,
    autoFocus,
    onKeyDown,
    onFocus,
    onValueChange,
  } = props

  const options: PropsValue<any> = data?.map((model) => {
    if (objectName === "documentType") {
      return { label: model.name, value: model.id }
    }
    if (objectName === "condicionIVAReceptorId") {
      return { label: model.name, value: model.id }
    }
    return { label: model.name, value: model._id }
  })
  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : undefined
  const reactSelectStyles = useReactSelectStyles()

  return (
    <FormControl
      isInvalid={
        !!formState.errors[field]?.message && !!formState.touchedFields[field]
      }
    >
      <FormLabel htmlFor={inputId ?? field}>{label}:</FormLabel>
      <Controller
        control={control}
        render={({ field: { onChange, value, name, ref, onBlur } }) => (
          <Select
            ref={ref}
            inputId={inputId}
            placeholder={placeholder}
            defaultValue={value}
            value={options?.filter((option: Option) => option.value === value)}
            name={name}
            isDisabled={isDisabled}
            isClearable={true}
            required={isRequired}
            noOptionsMessage={() => noOptionsMessage}
            options={options}
            menuPortalTarget={menuPortalTarget}
            menuPosition="fixed"
            autoFocus={autoFocus}
            styles={reactSelectStyles}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            onChange={(selectedOption) => {
              const nextValue = selectedOption ? selectedOption.value : ""
              onChange(nextValue)
              onValueChange?.(nextValue)
            }}
          />
        )}
        name={field}
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
