import React, { useCallback, useState, useRef } from 'react'
import { Textarea } from '@nextui-org/react'
import { CommentService } from '../../services'
import { useAuthed } from '../../hooks/useAuthed'

function WritePostComment({ postId, onSubmit }) {
  const { isAuthenticated } = useAuthed()
  const [comment, setComment] = useState('')

  const submitComment = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await CommentService.createPostComment(postId, comment)
        setComment('')
        onSubmit()
      } catch (err) {
        console.error(err)
      }
    }
  }, [isAuthenticated, postId, comment])

  const handleCommentKeydown = useCallback(
    (e) => {
      if (e.key === 'Enter' && comment) {
        submitComment()
      }
    },
    [comment, submitComment],
  )

  return (
    <Textarea
      variant="flat"
      labelPlacement="outside"
      placeholder="Write..."
      value={comment}
      onChange={(event) => setComment(event.target.value.slice(0, process.env.REACT_APP_MAX_POST_COMMENT_LENGTH))}
      maxRows={2}
      onKeyDown={handleCommentKeydown}
      className="max-w mt-2"
      classNames={{
        inputWrapper: 'rounded-md',
      }}
    />
  )
}

export default WritePostComment
