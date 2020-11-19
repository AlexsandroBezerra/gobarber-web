import React from 'react'
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi'

import logoImg from '../../assets/logo.svg'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { Background, Container, Content } from './styles'

const SignUp: React.FC = () => {
  return (
    <Container>
      <Background />

      <Content>
        <img src={logoImg} alt="GoBarber" width="230" />

        <form>
          <h1>Faça seu Cadastro</h1>

          <Input name="user" icon={FiUser} placeholder="Usuário" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />

          <Button type="submit">Entrar</Button>
        </form>

        <a href="/">
          <FiArrowLeft />
          Voltar para logon
        </a>
      </Content>
    </Container>
  )
}

export default SignUp
