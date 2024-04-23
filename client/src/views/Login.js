import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Link } from '@nextui-org/react'

import { useAuth } from '../hooks/useAuth'
import { useAuthed } from '../hooks/useAuthed'
import logo from '../assets/logo/dark/logo_with_wordmark.svg'

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

const Login = (props) => {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const { login } = useAuth()
  const [error, setError] = React.useState()
  const { isAuthenticated } = useAuthed()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated])

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
    <div className="h-screen pt-10 md:pt-0 bg-gradient-to-tr from-sky-900 to-purple-900">
      <div className="flex flex-col md:h-full md:flex-row items-center justify-center align-middle w-full px-4 md:px-0 gap-5 md:gap-0">
        <div className="flex h-full w-full items-center justify-center md:justify-end md:bg-slate-950 md:px-4">
          {/* <h1 className="text-center text-neutral-200 tracking-wider text-7xl font-semibold font-vibes">Snapsmaps</h1> */}
          <img src={logo} className="max-h-[80px]" />
        </div>
        <div className="flex  h-full w-full items-center justify-center md:bg-gradient-to-tr md:from-sky-900 md:to-purple-900 md:px-4">
          <Card className="w-full md:w-96 bg-background/50 ">
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
          <div className="absolute bottom-1 text-xs opacity-40">© 2024 Snapsmaps by Shane Israel</div>
        </div>
      </div>
    </div>
  )
}

Login.propTypes = {}

export default Login
