const userService = require('../services/user.js')

const enrollAdmin = async (req, res) => {
  const data = req.body
  const username = data.username
  const password = data.password
  const orgName = data.organizationName

  const result = await userService.enrollAdmin(username, password, orgName)

  res.status(result.code).send(result)
}

const registerAdminKementrian = async (req, res) => {
  const data = req.body
  const username = data.username
  const email = data.email

  const result = await userService.registerAdminKementrian(
    username,
    email,
    'Kementrian',
    'admin-kementerian'
  )
  res.status(result.code).send(result)
}

const registerUser = async (req, res) => {
  const data = req.body
  const username = data.username
  const email = data.email
  const orgName = data.organizationName
  const role = data.role

  const result = await userService.registerUser(
    req.user,
    username,
    email,
    orgName,
    role
  )
  res.status(result.code).send(result)
}

const loginUser = async (req, res) => {
  const data = req.body
  const username = data.username
  const password = data.password

  const result = await userService.loginUser(username, password)
  res.status(result.code).send(result)
}

const updateUser = async (req, res) => {
  const data = req.body
  const username = data.username
  const password = data.password
  const organizationName = data.organizationName
  const dataUser = data.dataUser
  const role = data.role

  const result = await userService.updateUser(
    organizationName,
    username,
    password,
    role,
    dataUser
  )

  res.status(result.code).send(result)
}

module.exports = {
  enrollAdmin,
  registerAdminKementrian,
  registerUser,
  loginUser,
  updateUser,
}
