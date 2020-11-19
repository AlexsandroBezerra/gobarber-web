import React from 'react'
import { FiLogIn } from 'react-icons/fi'

import logoImg from '../../assets/logo.svg'

import { Background, Container, Content } from './styles'

const SignIn: React.FC = () => {
  return (
    <Container>
      <Content>
        <img src={logoImg} alt="GoBarber" width="230" />

        <form>
          <h1>Faça seu Logon</h1>

          <input placeholder="E-mail" />
          <input type="password" placeholder="Senha" />

          <button type="submit">Entrar</button>

          <a href="forgot">Esqueci minha senha</a>
        </form>

        <a href="create">
          <FiLogIn />
          Criar conta
        </a>
      </Content>

      <Background />
    </Container>
  )
}

export default SignIn
