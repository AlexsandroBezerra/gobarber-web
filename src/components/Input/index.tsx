import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useCallback,
  useState
} from 'react'
import { IconBaseProps } from 'react-icons'
import { FiAlertCircle } from 'react-icons/fi'
import { useField } from '@unform/core'

import { Container, Error } from './styles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  containerStyle?: object
  icon?: React.ComponentType<IconBaseProps>
}

const Input: React.FC<InputProps> = ({
  name,
  containerStyle = {},
  icon: Icon,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { fieldName, registerField, defaultValue, error } = useField(name)

  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(Boolean(defaultValue))

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value'
    })
  }, [fieldName, registerField])

  const handleInputFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleInputBlur = useCallback(() => {
    setIsFocused(false)
    setIsFilled(Boolean(inputRef.current?.value))
  }, [])

  return (
    <Container
      isErrored={Boolean(error)}
      isFilled={isFilled}
      isFocused={isFocused}
      style={containerStyle}
      data-testid="input-container"
    >
      {Icon && <Icon size={20} />}
      <input
        defaultValue={defaultValue}
        ref={inputRef}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        {...rest}
      />

      {error && (
        <Error title={error}>
          <FiAlertCircle size={20} color="#c53030" />
        </Error>
      )}
    </Container>
  )
}

export default Input
