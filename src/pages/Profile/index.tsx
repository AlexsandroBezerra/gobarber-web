import React, { useCallback, useRef } from 'react'
import { FiUser, FiMail, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { useToast } from '../../hooks/Toast'

import { Container, Content, AvatarInput } from './styles'
import getValidationErrors from '../../utils/getValidationErrors'
import api from '../../services/api'
import { useAuth } from '../../hooks/Auth'

interface ProfileFormData {
  name: string
  email: string
  password: string
}

const Profile: React.FC = () => {
  const { user } = useAuth()

  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const history = useHistory()

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        await api.post('/users', data)

        addToast({
          type: 'success',
          title: 'Cadastro realizado',
          description: 'Você já pode fazer seu logon no GoBarber!'
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
          title: 'Erro no Cadastro',
          description: 'Ocorreu um erro ao fazer o cadastro, tente novamente.'
        })
      }
    },
    [history, addToast]
  )

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form
          onSubmit={handleSubmit}
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email
          }}
        >
          <AvatarInput>
            <img src={user.avatarUrl} alt={user.name} />
            <button type="button">
              <FiCamera />
            </button>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="oldPassword"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />

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
            placeholder="Confirmar senha"
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  )
}

export default Profile
