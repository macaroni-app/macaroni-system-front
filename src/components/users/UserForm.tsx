import { useState } from "react"

import { useNavigate, useParams } from "react-router-dom"

// components
import UserAddEditForm from "./UserAddEditForm"

// custom hooks
import { useMessage } from "../../hooks/useMessage"
import { useNewUser } from "../../hooks/useNewUser"
import { useEditUser } from "../../hooks/useEditUser"
import { Error, useError } from "../../hooks/useError"

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

import { IUser } from "./types"
import { useUsers } from "../../hooks/useUsers"

const UserForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { throwError } = useError()

  const { showMessage } = useMessage()

  const navigate = useNavigate()

  const { userId } = useParams()

  const queryUsers = useUsers({ id: userId })
  const userToUpdate = queryUsers.data ? { ...queryUsers?.data[0] } : {}

  const { addNewUser } = useNewUser()
  const { editUser } = useEditUser()

  const onSubmit = async (user: IUser) => {
    setIsLoading(true)

    const anUser = { ...user }
    anUser.role = Number(user.role)

    try {
      let response
      if (!userId) {
        response = await addNewUser(anUser)
        if (response.isStored) {
          showMessage(
            RECORD_CREATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      } else {
        console.log(user)
        // response = await editClient({
        //   clientId,
        //   clientToUpdate: { name },
        // })
        // if (response.isUpdated) {
        //   showMessage(
        //     RECORD_UPDATED,
        //     AlertStatus.Success,
        //     AlertColorScheme.Purple
        //   )
        // }
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
      isEditing={userId ? true : false}
      isLoading={isLoading}
    />
  )
}

export default UserForm
