import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'InitiativeProgressSubmissionWebPartStrings';
import InitiativeProgressSubmission from './components/InitiativeProgressSubmission';
import { IInitiativeProgressSubmissionProps } from './models/IInitiativeProgressSubmissionProps';
import { SPHttpClient } from "@microsoft/sp-http";

export interface IInitiativeProgressSubmissionWebPartProps {
  description: string;
  apiUrl: string;
  type: string;
  submissionListName: string;
  countryList: string;
  ngscList: string;
  needPDF: string;
  packageName:string;
}

export default class InitiativeProgressSubmissionWebPart extends BaseClientSideWebPart <IInitiativeProgressSubmissionWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IInitiativeProgressSubmissionProps> = React.createElement(
      InitiativeProgressSubmission,
      {
        context:this.context.spHttpClient,
        webcontext:this.context,
        description: this.properties.description,
        apiUrl:this.properties.apiUrl,
        type:this.properties.type,
        submissionListName: this.properties.submissionListName,
        countryList:this.properties.countryList,
        ngscList:this.properties.ngscList,
        needPDF:this.properties.needPDF,
        packageName: this.properties.packageName
      }
    );
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // protected get dataVersion(): Version {
  //   return Version.parse('1.0');
  // }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('packageName', {
                  label: strings.PackageName,
                  // value:'Initiative%20Progress%20Submission'
                }),
                PropertyPaneTextField('apiUrl', {
                  label: strings.BaseUrlFieldLabel,
                  // value:'https://sticsoftio.sharepoint.com/sites/poc'
                }),
                PropertyPaneTextField('type', {
                  label: strings.TypeFieldLabel,
                  // value:'Initiative%20Progress%20Submission'
                }),
                PropertyPaneTextField('submissionListName', {
                  label: strings.ListFieldLabel,
                  // value:'Initiative%20Progress%20Submission'
                }),
                PropertyPaneTextField('countryList', {
                  label: strings.CountryFieldLabel,
                  // value:'Initiative%20Progress%20Submission'
                }) ,              
                PropertyPaneTextField('ngscList', {
                  label: strings.NGSCListFieldLabel,
                  // value:'Initiative%20Progress%20Submission'
                }) ,              
                PropertyPaneTextField('needPDF', {
                  label: strings.NeedPDFLabel,
                  // value:'Initiative%20Progress%20Submission'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
