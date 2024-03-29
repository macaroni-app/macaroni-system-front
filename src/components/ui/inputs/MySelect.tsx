import { FormLabel, FormControl, FormErrorMessage } from "@chakra-ui/react"
import Select from "react-select"

interface Props {}

const MySelect = (props) => {
  const { formik, field, placeholder, label, isRequired, data, isDisabled } =
    props

  const handleSelect = (options) => {
    formik.setFieldValue(field, options?.value ? options?.value : "")
  }

  const options = data?.map((model) => {
    if (model.client) {
      return {
        label: `${model.client.name} - ${model.total}`,
        value: model._id,
      }
    }
    return { label: model.name, value: model._id }
  })

  return (
    <FormControl isInvalid={formik.errors[field] && formik.touched[field]}>
      <FormLabel htmlFor={field}>{label}:</FormLabel>
      <Select
        options={options}
        onChange={handleSelect}
        onBlur={(isTouched) => formik.setFieldTouched(field, isTouched)}
        isClearable={true}
        isDisabled={isDisabled}
        name={field}
        value={options?.filter((model) => model.value === formik.values[field])}
        id={field}
        placeholder={placeholder}
        noOptionsMessage={() => "No hay datos"}
        isInvalid={formik.errors[field] && formik.touched[field]}
        required={isRequired}
      />
      {formik.errors[field] && formik.touched[field] && (
        <FormErrorMessage>{formik.errors[field]}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export default MySelect
