import React from 'react';
import type { FC } from 'react';
import { Row, Col, Button, Divider, Layout } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import "./Layout.css"

type Props = {
    children?: React.ReactNode
    mainText: string
    buttons: React.ReactNode
  };

const Component: FC<Props> = ({children, mainText, buttons}) => {
  return (
    <Layout>
      <Layout.Header className='header'>
        <Row>
            <Col flex="32px"><Button type='text' icon={ <ArrowLeftOutlined/>}></Button></Col>
            <Col flex="20px"><Divider type='vertical'></Divider></Col>
            <Col flex="300px"><div>{mainText}</div></Col>
            <Col flex="auto" className='fill'>{buttons}</Col>
        </Row>
      </Layout.Header>
      <Layout.Content className='content'>
        {children}
      </Layout.Content>
    </Layout>)
};

export default Component;