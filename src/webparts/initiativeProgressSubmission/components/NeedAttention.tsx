import * as React from 'react';
import { IInitiativeProgressSubmissionProps } from '../models/IInitiativeProgressSubmissionProps';
import { Crudoperations } from '../services/SPServices';
import { IReportState } from '../models/IReportState';

import styles from './styles.module.scss';
import { Label, Dropdown, Icon, PrimaryButton } from 'office-ui-fabric-react';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import pptxgen from "pptxgenjs";
import { INeedAttentionState } from '../models/IDashboardState';
import LoadingOverlay from 'react-loading-overlay';
import Parser from 'html-react-parser';

// Used to add spacing between example checkboxes
const stackTokens = { childrenGap: 10 };

export class NeedAttention extends React.Component<IInitiativeProgressSubmissionProps, INeedAttentionState, {}>{
  public _spops: Crudoperations;


  constructor(props: IInitiativeProgressSubmissionProps) {
    super(props);
    this._spops = new Crudoperations(this.props);
    this.state = {
      needAttention: [],
      needAttentionMain: [],
      type: this.props.type,
      loading: true
    }
  }
  public componentDidMount() {
    const stopwords: any = ["n/a", 'na', 'none', 'n.a.', 'n.a', 'none required', 'none required at this point in time', 'no support needed at this point in time', ''];
    const attention: any = [];
    this.props.Items.map((x: any) => {
      console.log('test', x.Support_x0020__x002f__x0020_Atte);
      var key = x.Support_x0020__x002f__x0020_Atte.replace(/<\s*br[^>]?>/, '\n').replace(/(<([^>]+)>)/g, "").replace(/&#?[a-z0-9]+;/g, " ");
      // const key = (x.Support_x0020__x002f__x0020_Atte.replace(/<[^>]+>/g, '').replace(/&#?[a-z0-9]+;/g, " ").replace("&#8203;", '')).toLowerCase(); //old
      var incWord = (key.replace(/[^\x20-\x7E]/g, '')).toLowerCase();
      // const keyarray = key.trim();
      // console.log(keyarray);
      // const val = stopwords.find(x => x == keyarray);
      // console.log('valueee', val, key);
      // if (!val) { attention.push(x); }

      incWord = incWord.trim();
      const word = stopwords.includes(incWord);
      console.log('stop words', stopwords);
      console.log('word end1', incWord);
      console.log('word', word);
      if (!word) { attention.push(x) }
    });

    this.setState({ needAttention: attention, needAttentionMain: attention, loading: false })
  }
  public getsingleRecord(event) {
    console.log('change event', event.target.value);
    if (event.target.value == "All") {
      this.setState({ needAttention: this.state.needAttentionMain });
    }
    else {
      if (this.props.type == '1') {
        this.setState({
          needAttention: this.state.needAttentionMain.filter(x => x.InitiativeId == event.target.value)
        });
      }
      else if (this.props.type == '2') {
        this.setState({
          needAttention: this.state.needAttentionMain.filter(x => x.CountryId == event.target.value)
        });
      }
      else if (this.props.type == '3') {
        this.setState({
          needAttention: this.state.needAttentionMain.filter(x => x.NGSCId == event.target.value)
        });
      } else {
        this.setState({
          needAttention: this.state.needAttentionMain.filter(x => x.ProgramsId == event.target.value)
        });
      }
    }

  }
  public render(): React.ReactElement {
    const stopwords: string[] = ["n/a", '​na', '​na↵', 'none', 'n.a.', 'n.a', 'none required', '​NA', 'no support needed at this point in time', ''];
    return (
      <LoadingOverlay
        active={this.state.loading}
        spinner
        text="Loading"
      >
        <div>
          <div className="row m-1">
            <div className="col-12 px-0">
              <div className="card card-body" style={{ border: 'none' }}>
                <div>
                  <strong className={styles.counttwo}>Need Attention</strong>
                  {(this.props.type == '0' || this.props.type == '3') &&
                    <select className="form-control" onChange={() => { this.getsingleRecord(event) }}>
                      <option value="All">All</option>
                      {this.props.Programs.map((x: any) => {
                        return <option value={x.Title}>{x.Title}</option>
                      })}
                    </select>
                  }
                  {(this.props.type == '1' || this.props.type == '2') &&
                    <select className="form-control" onChange={() => { this.getsingleRecord(event) }}>
                      <option value="All">All</option>
                      {this.props.Initiative.map((x: any) => {
                        return <option value={x.Title}>{x.Title}</option>
                      })}
                    </select>
                  }
                </div>
              </div>
            </div>

          </div>
          <div className="row m-1">
            <div className="col-12 px-0" style={{ border: 'none' }}>
              {this.state.needAttention.map((x: any) => {
                console.log('working', x);
                return (<div className="my-3">
                  {/* <div className="col-1">
                                    <img src={require("../images/alert.png")} style={{ width: '20px' }} />
                                </div> */}
                  <div className=" card card-body shadow-sm" style={{ border: 'none' }}>
                    {this.state.type == '2' &&
                      <div>
                        <h5><strong>Country :</strong> {x.CountryId}</h5>
                        <h5><strong>Reported on : </strong>{x.Created}</h5>
                        <div className="">
                          <p><strong><i className="fa fa-exclamation-circle mr-2 text-danger"></i>Help Needed on :</strong> </p>
                          <div>{Parser(x.Support_x0020__x002f__x0020_Atte)}</div>
                        </div>
                      </div>
                    }
                    {this.state.type == '3' &&
                      <div>
                        <h5><strong>NGSC :</strong> {x.NGSCId}</h5>
                        <h5><strong>Country/Cluster :</strong> {x.Country_x002f_ClusterId}</h5>
                        <h5><strong>Reported on : </strong>{x.Created}</h5>
                        <div className="">
                          <p><strong><i className="fa fa-exclamation-circle mr-2 text-danger"></i>Help Needed on :</strong> </p>
                          <div>{Parser(x.Support_x0020__x002f__x0020_Atte)}</div>
                        </div>
                      </div>
                    }
                    {
                      (this.state.type != '3' && this.state.type != '2')  &&
                      <div>
                        {this.state.type == '0' && <h5><strong>Program :</strong> {x.ProgramsId}</h5>}
                        <h5><strong>Initiative : </strong>{x.InitiativeId}</h5>
                        <h5><strong>Reported on : </strong>{x.Created}</h5>
                        <p><strong><i className="fa fa-exclamation-circle mr-2 text-danger"></i>Help Needed on :</strong> </p>
                        <div>{Parser(x.Support_x0020__x002f__x0020_Atte)}</div>
                        

                      </div>
                    }
                  </div>
                </div>)
              })}
            </div>
          </div>
        </div>
      </LoadingOverlay>
    )
  }
}
