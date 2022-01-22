import { httpPost } from 'utils/network.js'


/* export const submitAvatar = async (avatar) => { */
/*   const r = await httpPostFile("/changeavatar", avatar */
/*   ) */
/* } */


export const changeEmail = async (email) => {
  const r = await httpPost("/changeemail", {
    "email": email
  })
  return r
}

export const changePassword = async (oldPassword, newPassword) => {
  const r = await httpPost("/changepassword", {
    "old_password": oldPassword,
    "new_password": newPassword
  })
  return r
}
