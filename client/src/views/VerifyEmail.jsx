import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthService from '../services/AuthService'
import { sleep } from '../common/utils'
import clsx from 'clsx'
import { Progress } from '@heroui/react'
import LogoWithWordmark from '../assets/logo/dark/LogoWithWordmark'

const VerifyEmail = (props) => {
  const { email, token } = useParams()
  const [verifiedMessage, setVerifiedMessage] = React.useState()
  const navigate = useNavigate()

  React.useEffect(() => {
    async function verify() {
      await sleep(2000)
      try {
        await AuthService.verify(email, token)
        setVerifiedMessage('Your account has been verified, redirecting...')
        sleep(2500).then(() => {
          navigate('/')
        })
      } catch (err) {
        setVerifiedMessage('Unable to verify, please check your verification link and try again.')
      }
    }
    verify()
  }, [email, token])

  return (
    <div className="flex flex-col w-screen h-screen items-center gap-4 bg-gradient-to-tr from-sky-900 to-purple-900 pt-10">
      <LogoWithWordmark className="max-h-[70px]" />
      {!verifiedMessage && (
        <>
          <div className="text-2xl font-semibold italic mt-5">Verifying your account...</div>
          <Progress size="sm" isIndeterminate aria-label="Loading..." className="w-[288px] max-w-[288px] mt-[-10px]" />
        </>
      )}
      {verifiedMessage && (
        <div
          className={clsx('text-2xl font-bold text-center mt-5', {
            'text-red-500': verifiedMessage.includes('Unable'),
          })}
        >
          {verifiedMessage}
        </div>
      )}
    </div>
  )
}

VerifyEmail.propTypes = {}

export default VerifyEmail
