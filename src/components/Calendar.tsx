'use client'

import { useState } from 'react'
import { Title, Text, Box } from '@mantine/core'
import dayjs from 'dayjs'

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  // Get the first day of the month and the number of days
  const firstDayOfMonth = currentDate.startOf('month')
  const daysInMonth = currentDate.daysInMonth()
  const firstDayOfWeek = (firstDayOfMonth.day() + 6) % 7 // 0 = Monday

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    // Fill the last week with nulls if needed
    while (days.length % 7 !== 0) {
      days.push(null)
    }
    return days
  }

  const calendarDays = generateCalendarDays()

  const handleDayClick = (day: number) => {
    const clickedDate = currentDate.date(day)
    setSelectedDate(clickedDate)
    // TODO: Add label functionality here
    console.log('Clicked on:', clickedDate.format('YYYY-MM-DD'))
  }

  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'))
  }

  const goToNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'))
  }

  // Fixed header and day header heights
  const HEADER_HEIGHT = 90
  const DAY_HEADER_HEIGHT = 40
  const GRID_GAP = 12 // px

  return (
    <Box
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        height: '100vh',
        width: '100vw',
        background: '#23272f',
        color: '#e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <Box style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr 80px',
        alignItems: 'center',
        height: HEADER_HEIGHT,
        padding: 0,
        margin: 0,
      }}>
        <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
          <button
            onClick={goToPreviousMonth}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#e0e0e0',
              marginRight: '1rem',
            }}
          >
            ←
          </button>
        </Box>
        <Title order={2} style={{ color: '#e0e0e0', fontWeight: 600, letterSpacing: 1, margin: 0, textAlign: 'center', width: '100%' }}>
          {currentDate.format('MMMM YYYY')}
        </Title>
        <Box style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '100%' }}>
          <button
            onClick={goToNextMonth}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#e0e0e0',
              marginLeft: '1rem',
            }}
          >
            →
          </button>
        </Box>
      </Box>
      {/* Day headers */}
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: '2px solid #E8E8E8',
          height: DAY_HEADER_HEIGHT,
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          columnGap: `${GRID_GAP}px`,
        }}
      >
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
          <Box
            key={day}
            style={{
              textAlign: 'right',
              padding: '0.5rem 0.5rem 0.5rem 0',
              fontWeight: 700,
              color: '#cfd8dc',
              fontSize: '1rem',
              letterSpacing: 1,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              boxSizing: 'border-box',
            }}
          >
            {day}
          </Box>
        ))}
      </Box>
      {/* Calendar grid */}
      <Box
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateRows: 'repeat(6, 1fr)',
          gridTemplateColumns: 'repeat(7, 1fr)',
          width: '100vw',
          height: `calc(100vh - ${HEADER_HEIGHT + DAY_HEADER_HEIGHT}px)`,
          maxWidth: '100vw',
          maxHeight: `calc(100vh - ${HEADER_HEIGHT + DAY_HEADER_HEIGHT}px)`,
          margin: 0,
          padding: 0,
          borderBottom: '2px solid #E8E8E8',
          borderTop: 'none',
          overflow: 'hidden',
          boxSizing: 'border-box',
          columnGap: `${GRID_GAP}px`,
          rowGap: '0px',
        }}
      >
        {calendarDays.map((day, idx) => {
          const isHovered = hoveredIdx === idx
          return (
            <Box
              key={idx}
              onClick={day ? () => handleDayClick(day) : undefined}
              onMouseEnter={day ? () => setHoveredIdx(idx) : undefined}
              onMouseLeave={day ? () => setHoveredIdx(null) : undefined}
              style={{
                cursor: day ? 'pointer' : 'default',
                position: 'relative',
                width: '100%',
                height: '100%',
                aspectRatio: '1 / 1',
                background: selectedDate && day && selectedDate.date() === day && selectedDate.month() === currentDate.month()
                  ? '#e0f2f1'
                  : isHovered && day
                    ? '#6c6e75'
                    : 'transparent',
                transition: 'background 0.2s',
                borderRadius: selectedDate && day && selectedDate.date() === day && selectedDate.month() === currentDate.month() ? '6px' : '0',
                borderBottom: (Math.floor(idx / 7) < 5) ? '2px solid #E8E8E8' : 'none',
                // No borderRight, gap handles separation
                boxSizing: 'border-box',
                overflow: 'hidden',
                margin: 0,
                padding: 0,
              }}
            >
              {day && (
                <Text
                  size="sm"
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 10,
                    color: selectedDate && selectedDate.date() === day && selectedDate.month() === currentDate.month() ? '#2d2d2d' : '#b0bec5',
                    fontWeight: 500,
                    fontSize: '1rem',
                  }}
                >
                  {String(day).padStart(2, '0')}
                </Text>
              )}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
} 