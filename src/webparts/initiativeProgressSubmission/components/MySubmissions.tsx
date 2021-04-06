import * as React from 'react';
import { Announced } from 'office-ui-fabric-react/lib/Announced';
import { TextField, ITextFieldStyles } from 'office-ui-fabric-react/lib/TextField';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import {Crudoperations} from '../services/SPServices';
import styles from './styles.module.scss';
import {ISubmission} from '../models/ISubmission';
import InitiativeProgressSubmission from './InitiativeProgressSubmission';
import { IInitiativeProgressSubmissionProps } from '../models/IInitiativeProgressSubmissionProps';

const exampleChildClass = mergeStyles({
  display: 'block',
  marginBottom: '10px',
});

const textFieldStyles: Partial<ITextFieldStyles> = { root: { maxWidth: '300px' } };

export interface IDetailsListBasicExampleItem {
  Title: string;
  ScopeStatus: string;
}

export interface  IMySubmissionsState {
  items: ISubmission[];
  selectionDetails: string;
  submits: ISubmission[];
}
export interface IMySubmissionsProps {
  submissions: ISubmission[];
}

export class MySubmissions extends React.Component<IMySubmissionsProps,  IMySubmissionsState> {
  private _selection: Selection;
  private _columns: IColumn[];
  
  constructor(props) {
    super(props);
    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() }),
    });


    this._columns = [
      { key: 'column1', name: 'Title', fieldName: 'Title', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column2', name: 'Program', fieldName: 'Program', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column2', name: 'ScopeStatus', fieldName: 'ScopeStatus', minWidth: 100, maxWidth: 200, isResizable: true },
    ];

    this.state = {
      items:[],
      selectionDetails: this._getSelectionDetails(),
      submits:[]
    };
  }
  public componentDidMount(): void {
    this.setState({
      items: this.props.submissions
    });
    console.log('props list', this.props.submissions);
  }

  public render(): JSX.Element {
    const { items, selectionDetails } = this.state;

    return (
      
      <Fabric>
        <div className={exampleChildClass}>{selectionDetails}</div>
        <Announced message={selectionDetails} />
        <TextField
          className={exampleChildClass}
          label="Filter by name:"
          onChange={this._onFilter}
          styles={textFieldStyles}
        />
        <Announced message={`Number of items after filter applied: ${items.length}.`} />
        <MarqueeSelection selection={this._selection}>
          <DetailsList
            items={items}
            columns={this._columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            selection={this._selection}
            selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="Row checkbox"
            onItemInvoked={this._onItemInvoked}
          />
        </MarqueeSelection>
      </Fabric>
    );
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as IDetailsListBasicExampleItem).Title;
      default:
        return `${selectionCount} items selected`;
    }
  }

  private _onFilter = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
    this.setState({
      items: text ? this.props.submissions.filter(i => i.InitiativeId.toLowerCase().indexOf(text) > -1) : this.props.submissions,
    });
  }

  private _onItemInvoked = (item: IDetailsListBasicExampleItem): void => {
    alert(`Item invoked: ${item.Title}`);
  }
}