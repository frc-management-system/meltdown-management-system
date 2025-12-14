import { EAssignmentActionType } from './EAssignmentActionType';

export type TAssignmentAction = {
  type: EAssignmentActionType;
  loadData?: string;
  matchNum?: number;
  editData?: {
    scouter: string;
    matchNum: number;
  }
};
