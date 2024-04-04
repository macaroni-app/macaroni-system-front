import { useState } from "react"

import { useNavigate, useParams } from "react-router-dom"

// components
import CategoryAddEditForm from "./CategoryAddEditForm"

// custom hooks
import { useCategories } from "../../hooks/useCategories"
import { useNewCategory } from "../../hooks/useNewCategory"
import { useEditCategory } from "../../hooks/useEditCategory"
import { useMessage } from "../../hooks/useMessage"
import { Error, useError } from "../../hooks/useError"

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import { ICategory } from "./types"

const CategoryForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { throwError } = useError()

  const { showMessage } = useMessage()

  const navigate = useNavigate()

  const { categoryId } = useParams()

  const queryCategories = useCategories({ id: categoryId })
  const categoryToUpdate = queryCategories?.data
    ? { ...queryCategories?.data[0] }
    : {}

  const { addNewCategory } = useNewCategory()
  const { editCategory } = useEditCategory()

  const onSubmit = async ({ name }: ICategory) => {
    setIsLoading(true)

    try {
      let response
      if (!categoryId) {
        response = await addNewCategory({ name })
        if (response.isStored) {
          showMessage(
            RECORD_CREATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      } else {
        response = await editCategory({
          categoryId,
          categoryToUpdate: { name },
        })
        if (response.isUpdated) {
          showMessage(
            RECORD_UPDATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      }
      if (response.status === 200 || response.status === 201) {
        navigate("/categories")
      }
    } catch (error: unknown) {
      throwError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const onCancelOperation = () => {
    navigate("/categories")
  }

  return (
    <CategoryAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={onCancelOperation}
      categoryToUpdate={categoryId ? categoryToUpdate : {}}
      isEditing={categoryId ? true : false}
      isLoading={isLoading}
    />
  )
}

export default CategoryForm
