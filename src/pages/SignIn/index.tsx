import React from 'react'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'
import { Form } from '@unform/web'

import logoImg from '../../assets/logo.svg'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { Background, Container, Content } from './styles'

const SignIn: React.FC = () => {
  function handleSubmit(data: object) {
    console.log(data)
  }

  return (
    <Container>
      <Content>
        <img src={logoImg} alt="GoBarber" width="230" />

        <Form onSubmit={handleSubmit}>
          <h1>Faça seu Logon</h1>

          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />

          <Button type="submit">Entrar</Button>

          <a href="/">Esqueci minha senha</a>
        </Form>

        <a href="/">
          <FiLogIn />
          Criar conta
        </a>
      </Content>

      <Background />
    </Container>
  )
}

export default SignIn
