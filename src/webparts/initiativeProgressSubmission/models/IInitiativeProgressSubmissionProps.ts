import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IDropdownOption } from 'office-ui-fabric-react';
import { ISubmission } from './ISubmission';
import { SPHttpClient } from "@microsoft/sp-http";

export interface IInitiativeProgressSubmissionProps {
  context?:SPHttpClient;
  webcontext?:WebPartContext;
  Programs?:any;
  Initiative?:any;
  Items?:any[];
  description?: string;
  apiUrl?: string;
  submissionListName?: string;
  type?: string;
  countryList?: string;
  needPDF?: string;
  packageName?: string;
  ngscList?: string;
  itemcount?:number;
  userCount?:number;
  ClickHandler?: (event: React.MouseEvent<HTMLButtonElement>) => void
}
