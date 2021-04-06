import { ISubmission } from "./ISubmission";

export interface IReportState {
  initiativeList:any;
  allInitiativeList:any;
  loading:boolean;
  isAll:boolean;
  countryDashboardList:any[];
  allCountryDashboardList:any[];
  selectedItem:string;
  isInitiative:boolean;
  selectedInitiative:any;
  selectvalue:string;
}