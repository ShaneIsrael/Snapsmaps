import adminRoutes from './admin.routes'
import authRoutes from './auth.routes'
import collectionRoutes from './collection.routes'
import commentRoutes from './comment.routes'
import feedRoutes from './feed.routes'
import likeRoutes from './like.routes'
import postRoutes from './post.routes'
import profileRoutes from './profile.routes'
import rootApiRoutes from './root.routes'
import shareRoutes from './share.routes'
import userRoutes from './user.routes'

export default class Routes {
  constructor(app) {
    app.use('/', shareRoutes)
    app.use('/api', rootApiRoutes)
    app.use('/api', adminRoutes)
    app.use('/api', authRoutes)
    app.use('/api', collectionRoutes)
    app.use('/api', commentRoutes)
    app.use('/api', feedRoutes)
    app.use('/api', likeRoutes)
    app.use('/api', postRoutes)
    app.use('/api', profileRoutes)
    app.use('/api', userRoutes)
  }
}
