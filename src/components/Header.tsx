import styled from 'styled-components'
import icon from '../assets/imgs/icon.png'

const Container = styled.div`
  width: 100%;
  max-width: 480px;
  display: flex;
  align-items: center;
  height: 2.5%;
  background-color: #888;
  padding: 4px 0;
`

const Icon = styled.img`
  height: 100%;
  margin: 0 2px 0 4px;
`

const Text = styled.span`
  font-size: 16px;
  color: #fff;
`

const Header = () => {
  return (
    <Container>
      <Icon src={icon} alt="icon" />
      <Text>밈미닌니</Text>
    </Container>
  )
}

export default Header