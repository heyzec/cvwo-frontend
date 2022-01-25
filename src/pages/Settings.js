import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { BsGithub } from 'react-icons/bs'
import { FcGoogle } from 'react-icons/fc'

import { changePassword, changeEmail, submitAvatar } from 'utils/settings'
import { getUser, deleteAccount, authGithubRedirect, authGoogleRedirect } from 'utils/user'
import { httpGet } from 'utils/network'

import ResponsivePage from 'modules/ResponsivePage'
import Header from 'components/Header'
import Identicon from 'components/Identicon'

import Button from 'material/Button'
import SelectableList from 'material/SelectableList'
import SelectableListItem from 'material/SelectableListItem'
import TextField from 'material/TextField'

import 'pages/Settings.css'

const Settings = ({ context }) => {

  const [user, setUser] = [context.getUser(), context.setUser]

  const [emailValue, setEmailValue] = useState("")
  const [oldPasswordValue, setOldPasswordValue] = useState("")
  const [newPasswordValue, setNewPasswordValue] = useState("")

  const [githubLinked, setGithubLinked] = useState(null)
  const [googleLinked, setGoogleLinked] = useState(null)

  const [currentTab, setCurrentTab] = useState(0)
  
  const [darkMode, setDarkMode] = [context.getDarkMode(), context.setDarkMode]


  // const fileSelected = (e) => setSelectedFile(e.target.files[0])
  // const [selectedFile, setSelectedFile] = useState(null)

  const navigate = useNavigate()


  // ---------------- Check for user details, but only after component is loaded  ----------------
  useEffect(() => {
    const asyncToDo = async () => {  // React's useEffect dislikes async functions
      const user = await getUser()
      if (!user) {
        return
      }
      setGoogleLinked(Boolean(user.google_id))
      setGithubLinked(Boolean(user.github_id))
    }
    asyncToDo()
  }, [])


  // ---------------- Event handlers  ----------------
  const emailValueChanged = (e) => setEmailValue(e.target.value)
  const oldPasswordValueChanged = (e) => setOldPasswordValue(e.target.value)
  const newPasswordValueChanged = (e) => setNewPasswordValue(e.target.value)


  // const submitAvatarClicked = async (e) => {
  //   console.log(selectedFile)
  //   await submitAvatar(selectedFile)
  // }

  const changeEmailClicked = async (e) => {
    const r = await changeEmail(emailValue)
    if (r.status !== 200) {
      context.toasts.error("Email is invalid.")
      return
    }
    alert("Email changed successfully.")
    window.location.reload()
  }

  const changePasswordClicked = async (e) => {
    if (!oldPasswordValue || !newPasswordValue) {
      context.toasts.error("Please fill in both fields.")
      return
    } else if (oldPasswordValue === newPasswordValue) {
      context.toasts.error("Both old and new passwords are the same, no changes made.")
      return
    }

    const r = await changePassword(oldPasswordValue, newPasswordValue)
    if (r.status === 200) {
      alert("Password changed successfully")
      return
    }
    if (r.status === 401) {
      context.toasts.error("Wrong password")
      return
    }
    const message = await r.text()
    context.toasts.delayedSuccess(message)
  }

  const closeAccountClicked = async (e) => {
    const prompt = "You are going to delete your account. THIS ACTION IS IRREVERSIBLE!"
    if (!window.confirm(prompt)) {
      return
    }
    await deleteAccount(context, navigate)
  }

  const extAuthGithubClicked = (e) => {
    e.preventDefault()  // This line is necessary
    authGithubRedirect()
  }

  const extAuthGoogleClicked = (e) => {
    e.preventDefault()
    authGoogleRedirect()
  }

  const getAvatar = (e) => {
    httpGet('/getavatar')
  }
  


  // ---------------- Tabs  ----------------

  const personalisationTab = (
    <div>
      <h1>Dark mode</h1>
      <span>Dark mode is currently {darkMode ? "enabled" : "disabled"}.</span>
      <br />
      <span>Protip: Press <kbd>x</kbd> to toggle on or off!</span>
      <Button
        className="settings__btn-dark-mode"
        onClick={() => setDarkMode((darkMode) => !darkMode)}
        variant="contained">
        {darkMode ? "Enable" : "Disable"}
      </Button>
    </div>
  )

  const getAccountTab = () =>  <>
    <Button onClick={getAvatar}>HEHE</Button>
    <div>
      <h1>Change display name</h1>
      <span>Your current name is blank</span>
    </div>
    <div>
      <h1>Avatar Image</h1>
      <div>
        <span>Here's your current avatar</span>
      </div>
      <Identicon context={context} size="100" />
      {
        // <div></div>
        // <input type="file" name="avatar" onChange={fileSelected} />
        // <Button variant="outlined" onClick={submitAvatarClicked}>Submit</Button>
      }
    </div>
    <div>
      <h1>Change email</h1>
      <span>Your current email is {user.email}</span>
      <TextField className="settings__input" label="New email" value={emailValue} onChange={emailValueChanged} />
      <Button variant="outlined" onClick={changeEmailClicked}>Submit</Button>
    </div>
    <div>
      <h1>Change password</h1>
      <TextField
        className="settings__input"
        type="password"
        label="Old password"
        value={oldPasswordValue}
        onChange={oldPasswordValueChanged}
      />
      <TextField
        className="settings__input"
        type="password"
        label="New password"
        value={newPasswordValue}
        onChange={newPasswordValueChanged}
      />
      <Button variant="outlined" onClick={changePasswordClicked}>Submit</Button>
    </div>
    <div>
      <h1>Linked accounts</h1>
      <span>Link your account for a seamless login experience!</span>
      <table className="settings__table">
        <tr>
          <td>
            <BsGithub size="35" />
          </td>
          {
            githubLinked
              ? <>
                <td>
                  <span>You have linked your GitHub account.</span>
                </td>
              </>
              : <>
                <td>
                  <span>Click here to link your GitHub account!</span>
                </td>
                <td>
                  <Button onClick={extAuthGithubClicked} variant="outlined">Link</Button>
                </td>
              </>
          }
        </tr>
        <tr>
          <td>
            <FcGoogle size="35" />
          </td>
          {
            googleLinked
              ? <>
                <td>
                  <span>You have linked your Google account.</span>
                </td>
              </>
              : <>
                <td>
                  <span>Click here to link your Google account!</span>
                </td>
                <td>
                  <Button onClick={extAuthGoogleClicked} variant="outlined">Link</Button>
                </td>
              </>
          }
        </tr>
      </table>
    </div>
    <div>
      <h1>Close account</h1>
      <div>
        <span>This will permenantly delete all your data from our databases.</span>
      </div>
      <Button
        className="settings__close-acc"
        variant="contained"
        onClick={closeAccountClicked}
      >
        Close account
      </Button>
    </div>
  </>

  // Remove the accounts tab if user has not created an account
  const allTabs = user ? [personalisationTab, getAccountTab()] : [personalisationTab]

  return (
    <ResponsivePage
      header={<Header context={context} />}
      drawer={
        <div className="settings__drawer">
          <div className="settings__head">
            <span>Settings</span>
            <hr />
          </div>
          <SelectableList>
            <SelectableListItem
              onClick={() => setCurrentTab(0)}
              selected={currentTab === 0}
            >
              Personalisation
            </SelectableListItem>
            {
              user
                ? (
                  <SelectableListItem
                    onClick={() => setCurrentTab(1)}
                    selected={currentTab === 1}
                  >
                    Account
                  </SelectableListItem>
                )
                : null
            }
          </SelectableList>
        </div>
      }
    >
      <div className="settings">
        {allTabs[currentTab]}
      </div>
    </ResponsivePage>
  )
}
export default Settings
