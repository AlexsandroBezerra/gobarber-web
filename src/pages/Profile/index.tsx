import React, { ChangeEvent, useCallback, useRef } from 'react'
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
  oldPassword: string
  password: string
  passwordConfirmation: string
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth()

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
          oldPassword: Yup.string(),
          password: Yup.string().when('oldPassword', {
            is: val => Boolean(val.length),
            then: Yup.string().min(6, 'No mínimo 6 dígitos'),
            otherwise: Yup.string()
          }),
          passwordConfirmation: Yup.string()
            .when('oldPassword', {
              is: val => Boolean(val.length),
              then: Yup.string().min(6, 'No mínimo 6 dígitos'),
              otherwise: Yup.string()
            })
            .oneOf([Yup.ref('password')], 'Confirmação incorreta')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        const {
          name,
          email,
          oldPassword,
          password,
          passwordConfirmation
        } = data

        const formData = Object.assign(
          {
            name,
            email
          },
          oldPassword
            ? {
                oldPassword,
                password,
                passwordConfirmation
              }
            : {}
        )

        const response = await api.put('/profile', formData)

        updateUser(response.data)

        addToast({
          type: 'success',
          title: 'Perfil atualizado',
          description:
            'Suas informações do perfil foram atualizadas com sucesso!'
        })

        history.push('/dashboard')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)

          return
        }

        addToast({
          type: 'error',
          title: 'Erro na Atualização',
          description: 'Ocorreu um erro ao atualizar perfil, tente novamente.'
        })
      }
    },
    [history, addToast, updateUser]
  )

  const handleAvatarChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const data = new FormData()

        data.append('avatar', event.target.files[0])

        const response = await api.patch('/users/avatar', data)

        updateUser(response.data)

        addToast({
          type: 'success',
          title: 'Avatar atualizado'
        })
      }
    },
    [addToast, updateUser]
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
            <label htmlFor="avatar">
              <FiCamera />

              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
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
