import React from 'react';
import { Button } from 'antd';
import Layout from '../layout'
import 'antd/dist/reset.css';
import { Calendar } from 'antd';
import type { Dayjs } from 'dayjs';
import type { CalendarMode } from 'antd/es/calendar/generateCalendar';
import './TeamSchedule.css';


export default () => {
    const onPanelChange = (value: Dayjs, mode: CalendarMode) => {
      console.log(value.format('YYYY-MM-DD'), mode);
    };
      
    return <Layout mainText='test' buttons={<Button></Button>}>
        <Calendar onPanelChange={onPanelChange} />
    </Layout>
};