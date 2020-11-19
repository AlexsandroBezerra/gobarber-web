import styled from 'styled-components'
import { shade } from 'polished'

export const Container = styled.button`
  background: #ff9000;
  border-radius: 10px;
  border: none;
  padding: 16px;
  margin-top: 24px;
  width: 100%;

  color: #312e38;
  font-weight: 500;

  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#ff9000')};
  }
`
