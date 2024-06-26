import { useState } from "react"

import { useNavigate, useParams } from "react-router-dom"

// components
import UserAddEditForm from "./UserAddEditForm"

// custom hooks
import { useMessage } from "../../hooks/useMessage"
import { useNewUser } from "../../hooks/useNewUser"
import { useEditUser } from "../../hooks/useEditUser"
import { useUsers } from "../../hooks/useUsers"
import { useRoles } from "../../hooks/useRoles"
import { Error, useError } from "../../hooks/useError"

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

// types
import { IUserLessRelated } from "./types"

const UserForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { throwError } = useError()

  const { showMessage } = useMessage()

  const navigate = useNavigate()

  const { userId } = useParams()

  const queryUsers = useUsers({ id: userId })
  const userToUpdate = queryUsers.data ? { ...queryUsers?.data[0] } : {}

  const queryRoles = useRoles({})
  const roles = queryRoles.data

  const { addNewUser } = useNewUser()
  const { editUser } = useEditUser()

  const onSubmit = async (user: IUserLessRelated) => {
    setIsLoading(true)

    try {
      let response
      if (!userId) {
        response = await addNewUser(user)
        if (response.isStored) {
          showMessage(
            RECORD_CREATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      } else {
        response = await editUser({
          userId,
          userToUpdate: { ...user },
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
        navigate("/users")
      }
    } catch (error: unknown) {
      throwError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const onCancelOperation = () => {
    navigate("/users")
  }

  return (
    <UserAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={onCancelOperation}
      userToUpdate={userId ? userToUpdate : {}}
      roles={roles}
      isEditing={userId ? true : false}
      isLoading={isLoading}
    />
  )
}

export default UserForm
