import React, { useCallback, useRef } from 'react'
import { FiLock } from 'react-icons/fi'
import { useHistory, useLocation } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'

import logoImg from '../../assets/logo.svg'

import getValidationErrors from '../../utils/getValidationErrors'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { Background, Container, AnimationContainer, Content } from './styles'
import { useToast } from '../../hooks/Toast'
import api from '../../services/api'

interface ResetPasswordDataForm {
  password: string
  passwordConfirmation: string
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const history = useHistory()
  const location = useLocation()

  const handleSubmit = useCallback(
    async (data: ResetPasswordDataForm) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          passwordConfirmation: Yup.string().oneOf(
            [Yup.ref('password')],
            'Confirmação incorreta'
          )
        })

        await schema.validate(data, {
          abortEarly: false
        })

        const { password, passwordConfirmation } = data
        const token = location.search.replace('?token=', '')

        if (!token) {
          throw new Error()
        }

        await api.post('/password/reset', {
          password,
          passwordConfirmation,
          token
        })

        history.push('/')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)

          return
        }

        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente.'
        })
      }
    },
    [addToast, history, location]
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" width="230" />

          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Resetar senha</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />

            <Input
              name="passwordConfirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação da senha"
            />

            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  )
}

export default ResetPassword
