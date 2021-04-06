import { ISubmission } from '../models/ISubmission';
import { IDropdownOption, IColumn, IGroup } from "office-ui-fabric-react";
import { Analysis } from '../models/Analysis';

export interface IDashboardState {
  listitems:Array<number>;
  onschedulecnt:number;
  minorissuescnt:number;
  behindschedulecnt:number;
  _data : {};
  datasetdata:number[];
  analysis:Analysis;
  prgm: any;
  needAttention:any[],
  hideDialog:boolean,
  attentionOne:any,
  selectedItem:string,
  trendData: any
  // trendData: Chart.ChartData
}
export interface INeedAttentionState {
  needAttention:any[],
  needAttentionMain:any[],
  type:string,
  loading:boolean
}
