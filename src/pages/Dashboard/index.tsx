import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { isToday, format, parseISO, isAfter } from 'date-fns'
import ptBr from 'date-fns/locale/pt-BR'
import DayPicker, { DayModifiers } from 'react-day-picker'
import 'react-day-picker/lib/style.css'

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar
} from './styles'

import logoImg from '../../assets/logo.svg'
import { FiClock, FiPower } from 'react-icons/fi'
import { useAuth } from '../../hooks/Auth'

import api from '../../services/api'

interface MonthAvailabilityItem {
  day: number
  available: boolean
}

interface Appointment {
  id: string
  date: string
  hourFormatted: string
  user: {
    name: string
    avatarUrl: string
  }
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([])

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day)
    }
  }, [])

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month)
  }, [])

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1
        }
      })
      .then(response => setMonthAvailability(response.data))
  }, [currentMonth, user.id])

  useEffect(() => {
    api
      .get<Appointment[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate()
        }
      })
      .then(response => {
        const appointmentsFormatted = response.data.map(appointment => {
          return {
            ...appointment,
            hourFormatted: format(parseISO(appointment.date), 'HH:mm')
          }
        })

        setAppointments(appointmentsFormatted)
      })
  }, [selectedDate])

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(day => !day.available)
      .map(day => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()

        return new Date(year, month, day.day)
      })

    return dates
  }, [currentMonth, monthAvailability])

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBr
    })
  }, [selectedDate])

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: ptBr
    })
  }, [selectedDate])

  const morningAppointments = useMemo(() => {
    return appointments.filter(
      appointment => parseISO(appointment.date).getHours() < 12
    )
  }, [appointments])

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(
      appointment => parseISO(appointment.date).getHours() >= 12
    )
  }, [appointments])

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date())
    )
  }, [appointments])

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatarUrl} alt={user.name} />

            <div>
              <span>Bem-vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>

          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>

              <div>
                <img
                  src={nextAppointment.user.avatarUrl}
                  alt={nextAppointment.user.name}
                />

                <strong>{nextAppointment.user.name}</strong>

                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento encontrado nesse período</p>
            )}

            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={appointment.user.avatarUrl}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento encontrado nesse período</p>
            )}

            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={appointment.user.avatarUrl}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: {
                daysOfWeek: [1, 2, 3, 4, 5]
              }
            }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro'
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  )
}

export default Dashboard
