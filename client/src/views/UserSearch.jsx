import React, { useEffect, useState } from 'react'
import { Input, Spinner } from "@heroui/react"
import { toast } from 'sonner'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import useDebounce from '../hooks/useDebounce'
import { UserService } from '../services'
import UserCard from '../components/Search/UserCard'
import ListEndCard from '../components/Search/ListEndCard'
import PageLayout from '../components/Layout/PageLayout'

const PAGE_SIZE = 10

function UserSearch() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [lastPageReached, setLastPageReached] = useState(false)
  const debouncedQuery = useDebounce(query, 500)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  async function search(p) {
    if (debouncedQuery.replace(/\s/g, '')) {
      try {
        if (!lastPageReached) {
          setLoading(true)
          const users = (await UserService.search(debouncedQuery, p)).data
          if (p > 0) {
            setUsers((prev) => prev.concat(users))
          } else {
            setUsers(users)
          }
          if (users.length < PAGE_SIZE) {
            setLastPageReached(true)
            toast.info('showing all results', {
              position: 'bottom-center',
            })
          }
        }
      } catch (err) {
        console.log(err)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    search(0)
  }, [debouncedQuery])

  useEffect(() => {
    setUsers([])
    setLastPageReached(false)
    setPage(0)
  }, [query])

  useEffect(() => {
    if (page > 0) {
      search(page)
    }
  }, [page])

  const hasScrolledBottom = (e) => {
    const bottom = Math.round(e.target.scrollHeight - e.target.scrollTop) === Math.round(e.target.clientHeight)
    if (bottom) {
      setPage((prev) => prev + 1)
    }
  }

  useEffect(() => {
    const scrollElement = document.getElementById('scroll-content')
    scrollElement.addEventListener('scroll', hasScrolledBottom)
    return () => {
      scrollElement.removeEventListener('scroll', hasScrolledBottom)
    }
  }, [])

  return (
    <PageLayout showNav={false} fullwidth>
      {({ user, isAuthenticated }) => (
        <>
          <div className="w-full h-[64px] border-b-1 b border-neutral-800">
            <Input
              isClearable
              autoFocus
              radius="none"
              placeholder="Search users..."
              variant="underlined"
              color="primary"
              startContent={
                <MagnifyingGlassIcon className="text-black/50 ml-3 mt-1  dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0 w-7 h-7" />
              }
              classNames={{
                inputWrapper: 'h-[64px]',
                input: 'text-xl',
              }}
              onValueChange={setQuery}
            />
          </div>
          <div id="scroll-content" className="flex-grow overflow-y-auto">
            {users.map((user) => (
              <UserCard key={user.mention} user={user} />
            ))}
            {!lastPageReached && users.length > 0 && (
              <ListEndCard label={'Load more results'} onClick={() => setPage((prev) => prev + 1)} />
            )}
            {loading && (
              <div className="w-full flex p-4 justify-center items-center">
                <Spinner size="lg" />
              </div>
            )}
          </div>
        </>
      )}
    </PageLayout>
  )
}

export default UserSearch
