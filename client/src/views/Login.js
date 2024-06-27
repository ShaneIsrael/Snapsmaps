import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Link } from '@nextui-org/react'

import { useAuth } from '../hooks/useAuth'
import { useAuthed } from '../hooks/useAuthed'
import Splash from '../components/Layout/Splash'

const inputStyles = {
  label: 'text-black/50 dark:text-white/90',
  input: [
    'bg-transparent',
    'text-black/90 dark:text-white/90',
    'placeholder:text-default-700/50 dark:placeholder:text-white/60',
    'font-semibold',
  ],
  innerWrapper: 'bg-transparent',
  inputWrapper: [
    'shadow-xl',
    'bg-default-200/10',
    'dark:bg-default/60',
    'backdrop-blur-xl',
    'backdrop-saturate-200',
    'hover:bg-default-200/70',
    'dark:hover:bg-default/70',
    'group-data-[focused=true]:bg-default-200/50',
    'dark:group-data-[focused=true]:bg-default/60',
    '!cursor-text',
  ],
}

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const { loading, isAuthenticated } = useAuthed()
  const { login } = useAuth()
  const [error, setError] = React.useState()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed')
    }
  }, [isAuthenticated])

  const handleLogin = async () => {
    try {
      await login(email, password)
      navigate('/feed')
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
    <Splash>
      <Card className="w-full md:w-96 bg-slate-950/80 border-neutral-100 border-small">
        <CardHeader className="p-4">
          <h2 className="font-bold text-xl">Sign-in</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-col w-full gap-2">
            <Input
              type="email"
              label="Email"
              variant="flat"
              value={email}
              onValueChange={setEmail}
              onKeyDown={handleKeyDown}
              className="w-full"
              classNames={inputStyles}
            />

            <Input
              type="password"
              label="Password"
              variant="flat"
              value={password}
              onValueChange={setPassword}
              onKeyDown={handleKeyDown}
              className="w-full"
              classNames={inputStyles}
            />
          </div>
          {error && (
            <div className="flex justify-center w-full mt-2 p-2 rounded-lg bg-red-600 bg-opacity-40 text-neutral-50 font-semibold border-medium border-red-600">
              {error}
            </div>
          )}
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="flex flex-wrap gap-2 justify-center w-full">
            <Button
              color="primary"
              variant="solid"
              className="w-full"
              isDisabled={!email || !password}
              onClick={handleLogin}
            >
              Sign in
            </Button>

            <Link onClick={() => navigate('/signup')} className="cursor-pointer text-sm">
              Don't have an account?
            </Link>
          </div>
        </CardFooter>
      </Card>
      <div className="flex w-full max-w-[360px] justify-evenly items-center">
        <div className="h-[1px] border-b-1 border-neutral-100 w-full" />
        <h2 className="mx-2  font-bold text-lg">OR</h2>
        <div className="h-[1px] border-b-1 border-neutral-100 w-full" />
      </div>
      <Button
        color="primary"
        variant="solid"
        className="w-full max-w-[360px] bg-slate-900 border-medium border-neutral-300 font-semibold"
        onClick={() => navigate('/feed')}
      >
        Continue as Guest
      </Button>
    </Splash>
  )
}

Login.propTypes = {}

export default Login
