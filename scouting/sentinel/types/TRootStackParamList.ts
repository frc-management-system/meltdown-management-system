import { ERobotState } from '.';
import { ERating2026 } from '../../common/types/2026';

export type TRootStackParamList = {
  Startup: undefined;
  MatchLogs: undefined;
  QRCapture: undefined;
  Prematch: undefined;
  Teleop: { initialRobotState: ERobotState };
  EndgameOne: undefined;
  EndgameTwo: { firingRating: ERating2026; fuelPlowRating: ERating2026; defenseRating: String };
  QRShow: { routeName: keyof TRootStackParamList; path: string };
  EditAssignment: undefined;
};
