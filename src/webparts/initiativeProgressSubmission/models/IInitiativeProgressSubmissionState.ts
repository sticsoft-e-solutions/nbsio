import { ISubmission, ISubmission2 } from './ISubmission';
import { IDropdownOption, IColumn, IGroup } from "office-ui-fabric-react";
import { Counts } from './Counts';
import { UserProfile } from './User';

export interface IInitiativeProgressSubmissionState {
  userDetails:UserProfile;
  srtName?:string;
  tab:number;
  filterTab:number;
  Programs:any;
  Initiative:any;
  items: any;
  ProgressReports: any;
  loading:boolean;
  alert:boolean;
  message:string;
  alertmessage:string;
  project: ISubmission;
  project2: ISubmission2;
  type?:string;
  status: string;
  showform: boolean;
  userCount: number;
  allCount: number;
  elementId: string;
  userId: any;
  autherId: number;
  dashboardCounts: Counts;
}
