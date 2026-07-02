import ScrollProgress from './components/layout/ScrollProgress'
import OpeningSection from './components/sections/OpeningSection'
import ApologyChatSection from './components/sections/ApologyChatSection'
import ReassuranceSection from './components/sections/ReassuranceSection'
import OverthinkingSection from './components/sections/OverthinkingSection'
import MadeForYouSection from './components/sections/MadeForYouSection'
import MainQuestionSection from './components/sections/MainQuestionSection'

// Apologies Web App — single-page vertical apology letter for Stasya.
// Six sections in order, per PRD §6 + reference/index.html.
export default function App() {
  return (
    <>
      <ScrollProgress />
      <main>
        <OpeningSection />
        <ApologyChatSection />
        <ReassuranceSection />
        <OverthinkingSection />
        <MadeForYouSection />
        <MainQuestionSection />
      </main>
    </>
  )
}
