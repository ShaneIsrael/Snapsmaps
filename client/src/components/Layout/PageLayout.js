import { Layout } from 'antd'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import React from 'react'

function PageLayout({ header, footer, children }) {
  return (
    <Layout style={{ height: '100%' }}>
      {header && <Header style={{ height: 64 }}>{header}</Header>}
      <Content>{children}</Content>
      {footer && <Footer>{footer}</Footer>}
    </Layout>
  )
}

export default PageLayout
