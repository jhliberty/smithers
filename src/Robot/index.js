// Robot Parts
import RobotTabs from './parts/RobotTabs'
import RobotCards from './parts/RobotCards'
import RobotUI from './parts/RobotUI'
import RobotTalk from './parts/RobotTalk'
import RobotPlugins from './parts/RobotPlugins'
import RobotUtils from './parts/RobotUtils'
import RobotEvents from './parts/RobotEvents'
import RobotActions from './parts/RobotActions'

const Robot = {
  ...RobotActions,
  ...RobotTabs,
  ...RobotCards,
  ...RobotUI,
  ...RobotTalk,
  ...RobotPlugins,
  ...RobotUtils,
  ...RobotEvents
}

Robot.loadVoices()

export default Robot
