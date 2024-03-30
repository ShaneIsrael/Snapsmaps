import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Link } from '@nextui-org/react'
import { toast } from 'sonner'
import { AuthService } from '../services'

const Signup = () => {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState('')
  const [displayName, setDisplayName] = React.useState('')
  const [mention, setMention] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [password2, setPassword2] = React.useState('')
  const [error, setError] = React.useState({ field: null, message: null })

  const validateEmail = (value) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)

  const isInvalidEmail = React.useMemo(() => {
    if (email === '') return false
    if (error.field === 'email') return error.message

    return validateEmail(email) ? false : true
  }, [email, error.field])

  const isInvalidDn = React.useMemo(() => {
    if (displayName === '') return false
    if (displayName.length < 5) return 'Too short'
    if (displayName.length > 32) return 'Too long'
    if (error.field === 'displayName') return error.message
  }, [displayName, error.field])

  const isInvalidMention = React.useMemo(() => {
    if (mention === '') return false
    if (mention.length < 4) return 'Too short'
    if (mention.length > 16) return 'Too long'
    if (mention.match(/[A-Z]/)) return 'Only lowercase letters, numbers, and underscores allowed.'
    if (!mention.match(/^\w+/)) return 'Only lowercase letters, numbers, and underscores allowed.'
    if (error.field === 'mention') return error.message
  }, [mention, error.field])

  const isInvalidPassword = React.useMemo(() => {
    if (password === '' && password2 === '') return false
    if (password === '' || password2 === '') return true
    if (error.field === 'password') return error.message

    return password !== password2
  }, [password, password2, error.field])

  const formValid = () =>
    validateEmail(email) && password && password2 && password === password2 && displayName !== '' && mention !== ''

  const getColor = (value, validator) => {
    if (!value) return 'default'
    else {
      return validator ? 'danger' : 'success'
    }
  }

  const submit = async () => {
    try {
      await AuthService.register(email, displayName, mention, password)
      toast.success('Account created, you can now log in.')
      navigate('/login')
    } catch (err) {
      console.log(err)
      if (err?.response?.status === 500) {
        toast.error('Unknown server error occurred, please try again later.')
      }
      if (err?.response?.status === 400 || err?.response?.status === 409) {
        setError(err.response.data)
      }
    }
  }

  return (
    <div className="h-screen">
      <div className="h-full flex flex-col justify-center">
        <div className="flex justify-center">
          <Card className="w-[400px] m-10">
            <CardHeader className="p-4">
              <h2 className="font-bold text-3xl">Create an account</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="flex flex-col w-full gap-4">
                <Input
                  type="email"
                  label="Email"
                  variant="flat"
                  value={email}
                  isInvalid={!!isInvalidEmail}
                  errorMessage={isInvalidEmail}
                  color={getColor(email, !!isInvalidEmail)}
                  onValueChange={setEmail}
                  className="w-full"
                />
                <Input
                  type="text"
                  label="Display name"
                  variant="flat"
                  value={displayName}
                  isInvalid={!!isInvalidDn}
                  errorMessage={isInvalidDn}
                  color={getColor(displayName, !!isInvalidDn)}
                  onValueChange={setDisplayName}
                  className="w-full"
                />
                <Input
                  type="text"
                  label="@ mention"
                  variant="flat"
                  value={mention}
                  isInvalid={!!isInvalidMention}
                  errorMessage={isInvalidMention}
                  color={getColor(mention, !!isInvalidMention)}
                  onValueChange={setMention}
                  className="w-full"
                />
                <Input
                  type="password"
                  label="Password"
                  variant="flat"
                  value={password}
                  isInvalid={!!isInvalidPassword}
                  color={getColor(password, !!isInvalidPassword)}
                  onValueChange={setPassword}
                  className="w-full"
                />
                <Input
                  type="password"
                  label="Confirm password"
                  variant="flat"
                  value={password2}
                  isInvalid={!!isInvalidPassword}
                  errorMessage={isInvalidPassword}
                  color={getColor(password2, !!isInvalidPassword)}
                  onValueChange={setPassword2}
                  className="w-full"
                />
              </div>
            </CardBody>
            <Divider />
            <CardFooter>
              <div className="flex flex-wrap gap-2 justify-center w-full">
                <Button color="primary" variant="solid" className="w-full" isDisabled={!formValid()} onClick={submit}>
                  Sign up
                </Button>
                <Link onClick={() => navigate('/login')} className="cursor-pointer text-sm">
                  Already have an account?
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

Signup.propTypes = {}

export default Signup
