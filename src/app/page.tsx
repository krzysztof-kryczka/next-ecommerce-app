import HeroSection from './HeroSection'
import Categories from './Categories'
import Recommendations from './Recommendations'
import Brands from './Brands'
import { JSX } from 'react'

const Home = (): JSX.Element => {
   return (
      <>
         <HeroSection />
         <Categories />
         <Recommendations />
         <Brands />
      </>
   )
}

export default Home
