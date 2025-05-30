import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Link } from '@heroui/react'
import { toast } from 'sonner'
import { AuthService } from '../../services'
import { useAuthed } from '../../hooks/useAuthed'

const inputStyles = {
  label: 'text-black/50 dark:text-white/90',
  input: [
    'bg-transparent',
    'text-black/90 dark:text-white/90',
    'placeholder:text-default-700/50 dark:placeholder:text-white/60',
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

const Signup = ({ onLogin }) => {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState('')
  const [displayName, setDisplayName] = React.useState('')
  const [mention, setMention] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [password2, setPassword2] = React.useState('')
  const [error, setError] = React.useState({ field: null, message: null })

  const { isAuthenticated } = useAuthed()

  const validateEmail = (value) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)

  const isInvalidEmail = React.useMemo(() => {
    if (email === '') return false
    if (error.field === 'email') return error.message

    return validateEmail(email) ? false : true
  }, [email, error.field])

  const isInvalidDn = React.useMemo(() => {
    if (displayName === '') return false
    if (displayName.length < 5) return 'Too short'
    if (displayName.length > import.meta.env.VITE_MAX_DISPLAY_NAME_LENGTH) return 'Too long'
    if (error.field === 'displayName') return error.message
  }, [displayName, error.field])

  const isInvalidMention = React.useMemo(() => {
    if (mention === '') return false
    if (mention.length < 4) return 'Too short'
    if (mention.length > import.meta.env.VITE_MAX_MENTION_LENGTH) return 'Too long'
    if (mention.match(/\s/)) return 'No spaces in mention names allowed'
    if (mention.match(/\@/)) return 'No @ symbol in mention names allowed'
    const match = mention.match(/[A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?/)
    if (!match || match[0] !== mention) return 'Only letters, numbers, periods, and underscores allowed.'
    if (error.field === 'mention') return error.message
  }, [mention, error.field])

  const isInvalidPassword = React.useMemo(() => {
    if (password === '' && password2 === '') return false
    if (password === '' || password2 === '') return true
    if (password.length > import.meta.env.VITE_MAX_PASSWORD_LENGTH)
      return `Password must be less than ${import.meta.env.VITE_MAX_PASSWORD_LENGTH} characters`
    if (error.field === 'password') return error.message

    return password !== password2
  }, [password, password2, error.field])

  const formValid = () =>
    validateEmail(email) && password && password2 && password === password2 && displayName !== '' && mention !== ''

  const getColor = (value, validator) => {
    if (!value) return 'default'
    else {
      return validator ? 'danger' : 'default'
    }
  }

  const submit = async () => {
    try {
      const resp = (await AuthService.register(email, displayName, mention, password)).data
      toast.success(resp, { duration: 5000 })
      navigate('/')
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

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed')
    }
  }, [isAuthenticated])

  return (
    <Card className="w-full md:w-96 bg-slate-950 border-neutral-100 border-small">
      <CardHeader className="p-4">
        <h2 className="font-bold text-xl">Create an account</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col w-full gap-2">
          <Input
            type="email"
            label="Email"
            variant="flat"
            value={email}
            size="sm"
            isInvalid={!!isInvalidEmail}
            errorMessage={isInvalidEmail}
            color={getColor(email, !!isInvalidEmail)}
            onValueChange={setEmail}
            className="w-full"
            classNames={inputStyles}
          />
          <Input
            type="text"
            label="Display name"
            variant="flat"
            size="sm"
            value={displayName}
            isInvalid={!!isInvalidDn}
            errorMessage={isInvalidDn}
            color={getColor(displayName, !!isInvalidDn)}
            onValueChange={setDisplayName}
            className="w-full"
            classNames={inputStyles}
          />
          <Input
            type="text"
            label="@ mention"
            variant="flat"
            size="sm"
            value={mention}
            isInvalid={!!isInvalidMention}
            errorMessage={isInvalidMention}
            color={getColor(mention, !!isInvalidMention)}
            onValueChange={setMention}
            className="w-full"
            classNames={inputStyles}
          />
          <Input
            type="password"
            label="Password"
            variant="flat"
            size="sm"
            value={password}
            isInvalid={!!isInvalidPassword}
            color={getColor(password, !!isInvalidPassword)}
            onValueChange={setPassword}
            className="w-full"
            classNames={inputStyles}
          />
          <Input
            type="password"
            label="Confirm password"
            variant="flat"
            size="sm"
            value={password2}
            isInvalid={!!isInvalidPassword}
            errorMessage={isInvalidPassword}
            color={getColor(password2, !!isInvalidPassword)}
            onValueChange={setPassword2}
            className="w-full"
            classNames={inputStyles}
          />
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex flex-wrap gap-2 justify-center w-full">
          <Button color="primary" variant="solid" className="w-full" isDisabled={!formValid()} onClick={submit}>
            Sign up
          </Button>
          <Link onClick={onLogin} className="cursor-pointer text-sm">
            Already have an account?
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

Signup.propTypes = {}

export default Signup
