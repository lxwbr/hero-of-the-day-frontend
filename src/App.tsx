import React from 'react';
import type { FC } from 'react';
import { theme } from 'antd';
import TeamSchedule from './components/team-schedule'
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';
import './App.css';

const App: FC = () => 
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: "#1da57a",
        colorBgBase: "#282c34",
      }
    }}>
    <TeamSchedule/>
  </ConfigProvider>

export default App;