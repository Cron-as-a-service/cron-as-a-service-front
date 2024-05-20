import { HeaderMegaMenu } from '../components/HeaderMegaMenu/HeaderMegaMenu.tsx';
import { Container } from '@mantine/core';
import { HeroTitle } from '../components/HeroTitle/HeroTitle.tsx';

export function App() {
  //const [count, setCount] = useState(0)

  return (
      <>
          <HeaderMegaMenu />
          <HeroTitle />
          <Container size="md">
          </Container>
      </>
  )
}
