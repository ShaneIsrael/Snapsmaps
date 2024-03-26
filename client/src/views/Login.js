import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Link } from '@nextui-org/react'

import { useAuth } from '../hooks/useAuth'

const Login = (props) => {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState()

  const handleLogin = async () => {
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data)
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (email && password) {
        handleLogin()
      }
    }
  }

  return (
    <div className="h-screen">
      <div className="h-full flex flex-col justify-center">
        <div className="flex justify-center">
          <Card className="w-[400px] m-10">
            <CardHeader className="p-4">
              <h2 className="font-bold text-3xl">Sign in</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="flex flex-col w-full gap-4">
                <Input
                  type="email"
                  label="Email"
                  variant="flat"
                  value={email}
                  onValueChange={setEmail}
                  className="w-full"
                />

                <Input
                  type="password"
                  label="Password"
                  variant="flat"
                  value={password}
                  onValueChange={setPassword}
                  className="w-full"
                />
              </div>
            </CardBody>
            <Divider />
            <CardFooter>
              <div className="flex flex-wrap gap-2 justify-center w-full">
                <Button
                  color="primary"
                  variant="solid"
                  className="w-full"
                  isDisabled={!email || !password}
                  onClick={() => navigate('/')}
                >
                  Sign in
                </Button>
                <Link onClick={() => navigate('/signup')} className="cursor-pointer text-sm">
                  Don't have an account?
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

Login.propTypes = {}

export default Login
