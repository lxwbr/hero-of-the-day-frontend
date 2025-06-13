'use client'

import { useState, useEffect } from 'react'
import { Title, Text, Box, Modal, TextInput, Button, Group } from '@mantine/core'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)
import { getAssignments, addAssignment, removeAssignment } from '@/utils/assignmentsApi'

interface CalendarProps {
  hero: string
}

export function Calendar({ hero }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [assignments, setAssignments] = useState<{ [date: string]: string[] }>({})

  // Load assignments on mount
  useEffect(() => {
    // Wait a bit for MSW to initialize in development
    const loadAssignments = async () => {
      try {
        // Small delay to ensure MSW is ready in development
        if (process.env.NODE_ENV === 'development') {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        const data = await getAssignments(hero);
        setAssignments(data);
      } catch (error) {
        console.error('Failed to load assignments:', error);
        // In development, if MSW fails, we can still work with empty assignments
        setAssignments({});
      }
    };
    
    loadAssignments();
  }, [hero])

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

  // For each assignment, track its spans independently
  type AssignmentEntry = { date: string, name: string, dayjs: dayjs.Dayjs }
  const assignmentEntries: AssignmentEntry[] = []
  Object.entries(assignments).forEach(([date, names]) => {
    names.forEach(name => {
      assignmentEntries.push({ date, name, dayjs: dayjs(date) })
    })
  })
  assignmentEntries.sort((a, b) => a.dayjs.valueOf() - b.dayjs.valueOf())

  const handleDayClick = (day: number) => {
    const clickedDate = currentDate.date(day)
    setSelectedDate(clickedDate)
    setModalOpen(true)
  }

  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'))
  }

  const goToNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'))
  }

  // Modal form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDate && email) {
      const dateKey = selectedDate.format('YYYY-MM-DD')
      const name = email.split('@')[0]
      addAssignment(hero, dateKey, name).then(setAssignments)
    }
    setModalOpen(false)
    setEmail('')
  }

  // Remove assignment for a given date and name
  const handleRemoveAssignment = (dateKey: string, name: string) => {
    removeAssignment(hero, dateKey, name).then(setAssignments)
  }

  // Fixed header and day header heights
  const DAY_HEADER_HEIGHT = 40
  const GRID_GAP = 12 // px

  // Generate a stable, matte color from a string (name)
  function getMatteColorFromName(name: string) {
    // Hash the name to a number
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Generate HSL values: hue from hash, fixed low saturation, fixed lightness
    const hue = Math.abs(hash) % 360;
    const saturation = 32; // matte, not too vibrant
    const lightness = 68; // matte, not too dark or light
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  // Helper to get a more contrasting color for faded label text
  function getMatteTextColorFromName(name: string) {
    // Use the same hue, but higher saturation and lower lightness for more contrast
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    const saturation = 44; // more saturated
    const lightness = 32; // darker
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

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
      {/* Modal for email input */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedDate ? selectedDate.format('D MMMM YYYY') : 'Select a day'}
        centered
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        styles={{
          content: { background: '#23272f', color: '#e0e0e0' },
          header: { background: '#23272f', color: '#e0e0e0' },
          body: { background: '#23272f', color: '#e0e0e0' },
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email address"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.currentTarget.value)}
            required
            type="email"
            autoFocus
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" style={{ background: '#4EA37D', color: '#fff' }}>
              Submit
            </Button>
          </Group>
        </form>
      </Modal>
      {/* Header */}
      <Box style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr 80px',
        alignItems: 'center',
        padding: '0.25rem 0',
        margin: 3,
      }}>
        <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button
            onClick={goToPreviousMonth}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#e0e0e0',
              marginRight: '1rem',
              padding: 0,
              height: 'auto',
            }}
          >
            ←
          </button>
        </Box>
        <Title order={2} style={{
          color: '#e0e0e0',
          fontWeight: 600,
          letterSpacing: 1,
          margin: 0,
          textAlign: 'center',
          width: '100%',
          fontSize: '1.25rem',
          lineHeight: 1.2,
        }}>
          {currentDate.format('MMMM YYYY')}
        </Title>
        <Box style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <button
            onClick={goToNextMonth}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#e0e0e0',
              marginLeft: '1rem',
              padding: 0,
              height: 'auto',
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
          height: `calc(100vh - ${DAY_HEADER_HEIGHT}px)`,
          maxWidth: '100vw',
          maxHeight: `calc(100vh - ${DAY_HEADER_HEIGHT}px)`,
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
          let dateKey: string | undefined
          let assignmentsForDay: { name: string, isStart: boolean }[] = []
          if (day) {
            const d = currentDate.date(day)
            dateKey = d.format('YYYY-MM-DD')
            // Find all assignments that start on this day
            const startingToday = assignmentEntries.filter(e => e.dayjs.isSame(d, 'day'))
            if (startingToday.length > 0) {
              // If any assignments start today, show only those (all as isStart)
              assignmentsForDay = startingToday.map(e => ({ name: e.name, isStart: true }))
            } else {
              // Otherwise, propagate all assignments that started most recently before this day
              // Find the latest start date on or before this day
              let latestDay: dayjs.Dayjs | undefined = undefined
              for (const entry of assignmentEntries) {
                if (entry.dayjs.isSameOrBefore(d, 'day')) {
                  if (!latestDay || entry.dayjs.isAfter(latestDay)) {
                    latestDay = entry.dayjs
                  }
                }
              }
              if (latestDay) {
                // Find all assignments that started on latestDay
                const latestAssignments = assignmentEntries.filter(e => e.dayjs.isSame(latestDay, 'day'))
                assignmentsForDay = latestAssignments.map(e => ({ name: e.name, isStart: false }))
              }
            }
          }
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
              {assignmentsForDay.map(({ name, isStart }, i) => (
                <Box
                  key={name}
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: 14 + i * 28, // stack vertically
                    background: isStart
                      ? getMatteColorFromName(name)
                      : 'rgba(240,240,240,0.92)',
                    color: isStart
                      ? '#fff'
                      : getMatteTextColorFromName(name),
                    borderRadius: 4,
                    padding: '1px 6px 1px 6px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    boxShadow: isStart ? '0 1px 4px 0 rgba(0,0,0,0.04)' : 'none',
                    pointerEvents: 'auto',
                    minWidth: 0,
                    border: isStart ? 'none' : `1.5px dashed ${getMatteColorFromName(name)}`,
                  }}
                >
                  <span style={{ fontWeight: 700, color: isStart ? '#fff' : getMatteTextColorFromName(name), fontSize: '0.82rem' }}>{name}</span>
                  {isStart && (
                    <button
                      type="button"
                      aria-label="Remove assignment"
                      onClick={e => {
                        e.stopPropagation();
                        if (dateKey) handleRemoveAssignment(dateKey, name)
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        fontWeight: 400,
                        fontSize: '0.95rem',
                        marginLeft: 1,
                        cursor: 'pointer',
                        lineHeight: 1,
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  )}
                </Box>
              ))}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
} 