import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { BsGithub } from 'react-icons/bs'
import { FcGoogle } from 'react-icons/fc'

import { changePassword, getUserDetails, changeEmail, deleteAccount } from "utils/settings"
import { authGithubRedirect, authGoogleRedirect } from "utils/auth"

import ResponsivePage from "components/ResponsivePage"
import Header from "components/Header"

import Button from "material/Button"
import SelectableList from "material/SelectableList"
import SelectableListItem from "material/SelectableListItem"
import TextField from "material/TextField"

import 'pages/Settings.css'

const Settings = ({ context }) => {
  
  const [emailValue, setEmailValue] = useState("")
  const [oldPasswordValue, setOldPasswordValue] = useState("")
  const [newPasswordValue, setNewPasswordValue] = useState("")
  
  const [githubLinked, setGithubLinked] = useState(false)
  const [googleLinked, setGoogleLinked] = useState(false)

  const [currentTab, setCurrentTab] = useState(0)

  const navigate = useNavigate()


  /***** Check for user details, but only after component is loaded*****/
  useEffect(async () => {
    const user = await getUserDetails()
    if (!user) {
      return
    }
    if (user.google_id) {
      setGoogleLinked(true)
    }
    if (user.github_id) {
      setGithubLinked(true)
    }
  }, [])
  
  
  /***** Event handlers *****/
  const emailValueChanged = (e) => setEmailValue(e.target.value)
  const oldPasswordValueChanged = (e) => setOldPasswordValue(e.target.value)
  const newPasswordValueChanged = (e) => setNewPasswordValue(e.target.value)
  
  const changeEmailClicked = async (e) => {
    const r = await changeEmail(emailValue)
    if (r.status !== 200) {
      context.notify("Email is invalid.")
      return
    }
    alert("Email changed successfully.")
    context.setUser(emailValue)
  }

  const changePasswordClicked = async (e) => {
    if (!oldPasswordValue || !newPasswordValue) {
      context.notify("Please fill in both fields.")
      return
    } else if (oldPasswordValue === newPasswordValue) {
      context.notify("Both old and new passwords are the same, no changes made.")
      return
    }

    const r = await changePassword(oldPasswordValue, newPasswordValue)
    if (r.status === 200) {
      alert("Password changed successfully")
      return
    }
    if (r.status === 401) {
      context.notify("Wrong password")
      return
    }
    context.notify(await r.text())
  }

  const closeAccountClicked = async (e) => {
      const prompt = `You are going to delete your account. THIS ACTION IS IRREVERSIBLE!`
      if (!window.confirm(prompt)) {
        return
      }
    await deleteAccount()
    context.setUser("")
    context.notify("Your account has been deleted. Goodbye!")
    navigate('/')
  }
  
  const extAuthGithubClicked = (e) => {
    e.preventDefault()  // This line is necessary
    authGithubRedirect()
  }

  const extAuthGoogleClicked = (e) => {
    e.preventDefault()
    authGoogleRedirect()
  }


  /***** Tabs *****/

  const tabAccount = <>
    <div>
      <h1>Change display name</h1>
      <span>Your current name is blank</span>
      {
          // <TextField className="settings__input" label="New email" value={emailValue} onChange={emailValueChanged} />
          // <Button variant="outlined" onClick={changeEmailClicked}>Submit</Button>
      }
    </div>
    <div>
      <h1>Change email</h1>
      <span>Your current email is {context.getUser()}</span>
      <TextField className="settings__input" label="New email" value={emailValue} onChange={emailValueChanged} />
      <Button variant="outlined" onClick={changeEmailClicked}>Submit</Button>
    </div>
    <div>
      <h1>Change password</h1>
      <TextField className="settings__input" type="password" label="Old password" value={oldPasswordValue} onChange={oldPasswordValueChanged} />
      <TextField className="settings__input" type="password" label="New password" value={newPasswordValue} onChange={newPasswordValueChanged} />
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
        <span>This will permenantly delete all your data from our databases</span>

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

  const tabPersonalisation = <>
    <h1>Dark mode</h1>
    <span>Hi</span>
    <Button variant="contained">Enable</Button>
  </>

  // Remove the accounts tab if user has not created an account
  const allTabs = context.getUser() ? [tabPersonalisation, tabAccount] : [tabPersonalisation]


  return (
    <ResponsivePage
      header={<Header context={context} />}
      drawer={
        <SelectableList>
          <SelectableListItem
            onClick={() => setCurrentTab(0)}
            selected={currentTab === 0}
          >
            Personalisation
          </SelectableListItem>
          <SelectableListItem
            onClick={() => setCurrentTab(1)}
            selected={currentTab === 1}
          >
            Account
          </SelectableListItem>
        </SelectableList>
      }
    >
      <div className="settings">
        {allTabs[currentTab]}
      </div>
    </ResponsivePage>
  )
}
export default Settings
