import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Link } from '@nextui-org/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState('')
  const [dn, setDn] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [password2, setPassword2] = React.useState('')

  const validateEmail = (value) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)

  const isInvalidEmail = React.useMemo(() => {
    if (email === '') return false

    return validateEmail(email) ? false : true
  }, [email])

  const isInvalidDn = React.useMemo(() => {
    if (dn === '') return false
  }, [dn])

  const isInvalidPassword = React.useMemo(() => {
    if (password === '' && password2 === '') return false
    if (password === '' || password2 === '') return true

    return password !== password2
  }, [password, password2])

  const formValid = () => validateEmail(email) && password && password2 && password === password2 && dn !== ''

  const getColor = (value, validator) => {
    if (!value) return 'default'
    else {
      return validator ? 'danger' : 'success'
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
                  isInvalid={isInvalidEmail}
                  errorMessage={isInvalidEmail && 'Please enter a valid email'}
                  color={getColor(email, isInvalidEmail)}
                  onValueChange={setEmail}
                  className="w-full"
                />
                <Input
                  type="text"
                  label="Display name"
                  variant="flat"
                  isInvalid={isInvalidDn}
                  errorMessage={isInvalidDn && 'Please enter a display name'}
                  color={getColor(dn, isInvalidDn)}
                  onValueChange={setDn}
                  className="w-full"
                />
                <Input
                  type="password"
                  label="Password"
                  variant="flat"
                  isInvalid={isInvalidPassword}
                  color={getColor(password, isInvalidPassword)}
                  onValueChange={setPassword}
                  className="w-full"
                />
                <Input
                  type="password"
                  label="Confirm password"
                  variant="flat"
                  isInvalid={isInvalidPassword}
                  errorMessage={isInvalidPassword && 'Passwords do not match.'}
                  color={getColor(password2, isInvalidPassword)}
                  onValueChange={setPassword2}
                  className="w-full"
                />
              </div>
            </CardBody>
            <Divider />
            <CardFooter>
              <div className="flex flex-wrap gap-2 justify-center w-full">
                <Button color="primary" variant="solid" className="w-full" isDisabled={!formValid()}>
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
