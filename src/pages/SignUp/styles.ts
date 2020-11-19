import styled from 'styled-components'
import { shade } from 'polished'

import signUpBackgroundImg from '../../assets/sign-up-background.png'

export const Container = styled.div`
  height: 100vh;

  display: flex;
  align-items: stretch;
`

export const Content = styled.div`
  width: 100%;
  max-width: 700px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  form {
    text-align: center;

    margin: 65px 0;
    width: 340px;

    h1 {
      margin-bottom: 24px;
    }
  }

  > a {
    color: #f4ede8;
    display: block;
    margin-top: 18px;
    text-decoration: none;

    display: flex;
    align-items: center;

    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#f4ede8')};
    }

    svg {
      margin-right: 16px;
    }
  }
`

export const Background = styled.div`
  background: url(${signUpBackgroundImg}) no-repeat center;
  background-size: cover;

  flex: 1;
`
