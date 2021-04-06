import * as React from 'react';
import { IInitiativeProgressSubmissionProps } from '../models/IInitiativeProgressSubmissionProps';
import { Crudoperations } from '../services/SPServices';
import { IReportState } from '../models/IReportState';

import styles from './styles.module.scss';
import { Label, Dropdown, Icon, PrimaryButton } from 'office-ui-fabric-react';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import pptxgen from "pptxgenjs";
import * as moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Parser from 'html-react-parser';
import domToPdf from 'dom-to-pdf';

// Used to add spacing between example checkboxes
const stackTokens = { childrenGap: 10 };

export class Reports extends React.Component<IInitiativeProgressSubmissionProps, IReportState, {}>{
  public _spops: Crudoperations;

  constructor(props: IInitiativeProgressSubmissionProps) {
    super(props);
    this._spops = new Crudoperations(this.props);
    this.state = {
      initiativeList: [],
      allInitiativeList: [],
      loading: true,
      countryDashboardList: [],
      allCountryDashboardList: [],
      isAll: true,
      selectedItem: this._getselectedItem(),
      isInitiative: false,
      selectedInitiative: {},
      selectvalue: "All"
    }
    this.generateReport = this.generateReport.bind(this);
  }

  public async componentDidMount() {
    console.log('reports did mount', this.props);
    var realItems: any = [];
    if (this.props.type == '0' || this.props.type == '3') {
      this.props.Programs.map(z => {
        console.log('title ', z.Title);
        if (this.props.type == '0') {
          const lengthArray = this.props.Items.filter(x => x.ProgramsId == z.Title);
          lengthArray.forEach((x, index) => {
            if (index == 0) { x.Count = lengthArray.length; x.Status1 = true; }
            realItems.push(x);
          });
        }
        if (this.props.type == '3') {
          const lengthArray = this.props.Items.filter(x => x.NGSCId == z.Title);
          lengthArray.forEach((x, index) => {
            if (index == 0) { x.Count = lengthArray.length; x.Status1 = true; }
            realItems.push(x);
          });
        }
      })
    } else {
      realItems = this.props.Items;
    }
    this.setState({
      initiativeList: realItems, allInitiativeList: realItems,
      loading: false
    });
  }
  public generateReport(event) {
    console.log(event.target.value);
    console.log('clicked', this.state.allInitiativeList);
    if (event.target.value == "All" || event.target.value == undefined) {
      // document.getElementById('selectvalue').nodeValue = "All";
      this.setState({
        initiativeList: this.state.allInitiativeList, selectvalue: "All"
      })
    }
    else {
      if (this.props.type == '0') {
        this.setState({
          initiativeList: this.state.allInitiativeList.filter(x => x.ProgramsId == event.target.value), selectvalue: event.target.value
        })
      }
      if (this.props.type == '1') {
        this.setState({
          initiativeList: this.state.allInitiativeList.filter(x => x.InitiativeId == event.target.value), selectvalue: event.target.value
        })
      }
      if (this.props.type == '2') {
        this.setState({
          initiativeList: this.state.allInitiativeList.filter(x => x.CountryId == event.target.value), selectvalue: event.target.value
        })
      }
      if (this.props.type == '3') {
        this.setState({
          initiativeList: this.state.allInitiativeList.filter(x => x.NGSCId == event.target.value), selectvalue: event.target.value
        })
      }
    }

  }
  genPPt(type) {
    console.log('type ', type);
    if (type == '0' || type == '1') {
      this.generatePPT();
    } else {
      this.generatePPT1();
    }
  }
  createNotification = (type) => {
    console.log('message', type);
    return () => {
      switch (type) {
        case 'info':
          NotificationManager.info('Info message');
          break;
        case 'success':
          NotificationManager.success('please check your download folder..', 'Pdf generated successfully', 5000);
          // if (this.props.type == '0' || this.props.type == '1') {
          this.generatePdf();
          // } else {
          //     this.generatePPT1();
          // }
          break;
        case 'warning':
          NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
          break;
        case 'error':
          NotificationManager.error('Error message', 'Error', 5000);
          break;
      }
    };
  }
  generatePdf = () => {
    console.log('pdf gen');
    this.setState({ loading: true })
    const element = document.getElementById('pdfGen');
    element.removeAttribute('hidden');
    console.log('elements', element);
    const options = {
      filename: "nbs-progress-report.pdf",

    };
    return domToPdf(element, options, () => {
      console.log('done');
      element.setAttribute('hidden', "true");
      this.setState({ loading: false });
      this.createNotification('success');
    });
  }
  public render(): React.ReactElement {
    const type = this.props.type;
    var typevalue = "";
    var programvalue = this.props.packageName;
    if (type == '2') { programvalue = "Country"; }
    if (type == '3') { programvalue = "NGSC Country"; }
    if (type == '0') { programvalue = "Initiative"; }
    if (type == '1') { programvalue = "Initiative"; }


    return (
      <LoadingOverlay
        active={this.state.loading}
        spinner
        text="Loading .."
      >
        <div className={styles.initiativeProgressSubmission}>
          <NotificationContainer />
          <div>
            <div className={styles.contianer}>
              <div className="row">
                <div className="col-12 mt-2">
                  <div className={styles.ReportsSection}>
                    <div className={styles.ProgramStatsCard}>
                      <div className={styles.CardHeader}>
                        <h6>{this.props.packageName} Progress Report Summary</h6>
                      </div>

                      <div className="card card-body shadow-sm" style={{ border: 'none' }}>
                        {this.state.isInitiative && <a className="text-primary" onClick={() => { this.setState({ isInitiative: false }) }}>	&lt; Back to Dashboard Summary</a>}
                        {this.state.isInitiative == false && <div className="row my-3">
                          <div className="col-4">
                            {/* <Label>Select:</Label> */}
                            {(type == '0' || type == '3') &&
                              <select id="selectvalue" value={this.state.selectvalue} className="form-control" onChange={() => { this.generateReport(event) }}>
                                <option value="All">All</option>
                                {this.props.Programs.map((x: any) => {
                                  return <option value={x.Title}>{x.Title}</option>
                                })}
                              </select>
                            }
                            {(type == '1' || type == '2') &&
                              <select id="selectvalue" className="form-control" onChange={() => { this.generateReport(event) }}>
                                <option value="All">All</option>
                                {this.props.Initiative.map((x: any) => {
                                  return <option value={x.Title}>{x.Title}</option>
                                })}
                              </select>
                            }
                          </div>
                          <div className="col-8">
                            {/* {this.props.needPDF == '1' && <button className={styles.BtneOne} onClick={this.generatePPT}>Generate PPT</button>}  */}
                            <div>
                              <button className="btn btn-default" style={{ marginRight: '5px' }} value="All" onClick={() => { this.generateReport(event) }}>Clear</button>
                              {((type == '0' || type == '1') && this.props.needPDF == '1') &&
                                <button className="btn btn-primary" style={{ marginRight: '5px' }} onClick={() => this.genPPt(type)} >Generate PPT</button>
                              }
                              {((type == '2' || type == '3') && this.props.needPDF == '1') &&
                                <button className="btn btn-primary" style={{ marginRight: '5px' }} onClick={() => this.genPPt(type)}>Generate PPT</button>
                              }
                              <button className="btn btn-primary" style={{ marginRight: '5px' }} onClick={this.createNotification('success')}>Generate PDF</button>
                            </div>
                            {/* <PrimaryButton className={styles.BtneOne} text="Reset"></PrimaryButton> */}

                          </div>
                        </div>}<hr />
                        <div>
                          <div className="my-4">
                            <span>
                              <span className="px-2">
                                <a className="mr-1" style={{ color: '#bceb3c' }}>■︎</a>On Schedule
                                                   </span>
                              <span className="px-2">
                                <a className="mr-1" style={{ color: '#f5a31a' }}>■</a>Minor Issues
                                                   </span>
                              <span className="px-2">
                                <a className=" mr-1" style={{ color: '#f05d23' }}>■</a>Need Help
                                                   </span>
                            </span>
                            <span className="float-right">
                              <span className="px-2">
                                <a className="mr-1" style={{ color: 'gray' }}> ▲</a>Trending Up
                                                   </span>
                              <span className="px-2">
                                <a className="mr-1" style={{ color: 'gray' }}> ▶</a>Stable
                                                   </span>
                              <span className="px-2">
                                <a className="mr-1" style={{ color: 'gray' }}>▼ </a>Trending down
                                                   </span>
                            </span>
                          </div>

                          {this.state.isInitiative &&
                            <div>
                              {(type == '0' || type == '1') && <h4> {this.state.selectedInitiative.InitiativeId} : </h4>}
                              {type == '2' && <h4> {this.state.selectedInitiative.CountryId} : </h4>}
                              {type == '3' && <h4> {this.state.selectedInitiative.Country_x002f_ClusterId} : </h4>}
                              <div className="row">
                                <div className="col-6">
                                  <h5>Key achievements in period</h5>
                                  {(type == '0' || type == '1') &&
                                    <div style={{ border: '1px solid black', height: '150px', width: '100%', overflowY: 'scroll', maxHeight: '140px' }}>
                                      {Parser(this.state.selectedInitiative.Key_x0020_Achievements)}
                                    </div>
                                  }
                                  {(type == '2' || type == '3') &&
                                    <div style={{ border: '1px solid black', height: '150px', width: '100%', overflowY: 'scroll', maxHeight: '140px' }}>
                                      {Parser(this.state.selectedInitiative.Key_x0020_Achievements_x0020_in_)}
                                    </div>
                                  }
                                </div>
                                <div className="col-6">
                                  <h5>Key activities in next period</h5>
                                  <div style={{ border: '1px solid black', height: '150px', width: '100%', overflowY: 'scroll', maxHeight: '140px' }}>
                                    {Parser(this.state.selectedInitiative.Key_x0020_Activities_x0020_for_x)}
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-12">
                                  <h5>Support / Attention needed</h5>
                                  <div style={{ border: '1px solid black', height: '70px', width: '100%', overflowY: 'scroll', maxHeight: '140px' }}>
                                    {Parser(this.state.selectedInitiative.Support_x0020__x002f__x0020_Atte)}
                                  </div>
                                </div>
                              </div>
                            </div>}
                          {this.state.isInitiative == false &&
                            <div>
                              {(type == '0' || type == '1') &&
                                <div className="table-resposive" style={{ overflowX: "scroll" }}>
                                  <table className="table table-bordered  mb-0" id="tabAutoPaging">
                                    <thead>
                                      <tr className="bg-light text-center">
                                        {this.props.type == '0' && <th className="text-center" scope="col" style={{ width: '25%' }}>Programs</th>}
                                        {/* {this.props.type == '3' && <th scope="col" style={{ width: '25%' }}>NGSC</th>} */}
                                        <th className="text-center" scope="col" style={{ width: '25%' }}>Initiative</th>
                                        <th className="text-center" scope="col" style={{ width: '9%' }}>Scope</th>
                                        <th className="text-center" scope="col" style={{ width: '9%' }}>Schedule</th>
                                        <th className="text-center" scope="col" style={{ width: '9%' }}>Business case</th>
                                        <th className="text-center" scope="col" style={{ width: '9%' }}>Communication & Comm.</th>
                                        <th className="text-center" scope="col" style={{ width: '9%' }}>Impact on ops</th>
                                        <th className="text-center" scope="col" style={{ width: '9%' }}>Overall</th>
                                        <th className="text-center" scope="col" style={{ width: '14%' }}>Report Date</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-center">
                                      {this.state.initiativeList.map((x: any) => {
                                        return (
                                          <tr>
                                            {x.Status1 == true ? <td className="align-middle" rowSpan={x.Count}>{x.ProgramsId}</td> : ''}
                                            <td className="text-left" onClick={() => { this.getInitiative(x.InitiativeId) }}>{x.InitiativeId} </td>
                                            {(() => {
                                              let colorr = '#a6cb12';
                                              if (x.Scope_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                              if (x.Scope_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                              switch (x.Scope_x0020_Trend) {
                                                case 'Trending up':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                                case 'Trending down':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                                case 'Stable':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                                default:
                                                  return <td className="align-middle"></td>
                                              }
                                            })()}
                                            {(() => {
                                              let colorr = '#a6cb12';
                                              if (x.Schedule_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                              if (x.Schedule_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                              switch (x.Schedule_x0020_Trend) {
                                                case 'Trending up':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                                case 'Trending down':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                                case 'Stable':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                                default:
                                                  return <td className="align-middle"></td>
                                              }
                                            })()}
                                            {(() => {
                                              let colorr = '#a6cb12';
                                              if (x.Budget_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                              if (x.Budget_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                              switch (x.Budget_x0020_Trend) {
                                                case 'Trending up':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                                case 'Trending down':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                                case 'Stable':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                                default:
                                                  return <td className="align-middle"></td>
                                              }
                                            })()}
                                            {(() => {
                                              let colorr = '#a6cb12';
                                              if (x == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                              if (x.Change_x0020__x0026__x0020_Comms == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                              switch (x.Change_x0020__x0026__x0020_Comms0) {
                                                case 'Trending up':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                                case 'Trending down':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                                case 'Stable':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                                default:
                                                  return <td className="align-middle"></td>
                                              }
                                            })()}
                                            {(() => {
                                              let colorr = '#a6cb12';
                                              if (x == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                              if (x.Impact_x0020_On_x0020_Operations == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                              switch (x.Impact_x0020_On_x0020_Operations0) {
                                                case 'Trending up':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                                case 'Trending down':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                                case 'Stable':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                                default:
                                                  return <td className="align-middle"></td>
                                              }
                                            })()}
                                            {/* <th className="align-middle"  scope="col" style={{ width: '9%' }}>▲</th> */}
                                            {/* <th className="align-middle"  scope="col" style={{ width: '9%' }}>▲</th> */}
                                            {(() => {
                                              let colorr = '#a6cb12';
                                              if (x.Overall_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                              if (x.Overall_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                              switch (x.Overall_x0020_Trend) {
                                                case 'Trending up':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                                case 'Trending down':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                                case 'Stable':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                                default:
                                                  return <td className="align-middle"></td>
                                              }
                                            })()}
                                            <td className="align-middle">{x.Created}</td>
                                          </tr>
                                        )
                                      })}

                                    </tbody>
                                  </table>
                                </div>
                              }
                              {(type == '2' || type == '3') &&
                                <div className="table-resposive">
                                  <table className="table table-bordered" id="tabAutoPaging">
                                    <thead>
                                      <tr className="bg-light">
                                        {this.props.type == '3' && <th className="text-center" scope="col" style={{ width: '10%' }}>NGSC</th>}
                                        {this.props.type == '3' && <th className="text-center" scope="col" style={{ width: '8%' }}>NGSC Country</th>}
                                        {this.props.type == '2' && <th className="text-center" scope="col" style={{ width: '18%' }}>Country</th>}
                                        <th className="text-center" scope="col" style={{ width: '8%' }}>Bundle 1</th>
                                        <th className="text-center" scope="col" style={{ width: '8%' }}>Bundle 2</th>
                                        <th className="text-center" scope="col" style={{ width: '8%' }}>Bundle 3</th>
                                        <th className="text-center" scope="col" style={{ width: '8%' }}>Bundle 4</th>
                                        <th className="text-center" scope="col" style={{ width: '8%' }}>Bundle 5</th>
                                        <th className="text-center" scope="col" style={{ width: '8%' }}>Bundle 7</th>
                                        <th className="text-center" scope="col" style={{ width: '8%' }}>Bundle 8</th>
                                        <th className="text-center" scope="col" style={{ width: '8%' }}>Change and Comms</th>
                                        <th className="text-center" scope="col" style={{ width: '8%' }}>Overall</th>
                                        <th className="text-center" scope="col" style={{ width: '10%' }}>Report Date</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-center">
                                      {this.state.initiativeList.map((x: any) => {
                                        return (
                                          <tr>
                                            {x.Status1 == true ? <td className="align-middle" rowSpan={x.Count}>{x.NGSCId}</td> : ''}
                                            {this.props.type == '3' && <td className="text-left" onClick={() => { this.getInitiative(x.Country_x002f_ClusterId) }}>{x.Country_x002f_ClusterId}</td>}
                                            {this.props.type == '2' && <td className="text-left" onClick={() => { this.getInitiative(x.CountryId) }}>{x.CountryId}</td>}
                                            {(() => {
                                              let colorr = '#a6cb12';
                                              if (x.Bundle_x0020_1_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                              if (x.Bundle_x0020_1_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                              switch (x.Bundle_x0020_1_x0020_Trend) {
                                                case 'Trending up':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                                case 'Trending down':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                                case 'Stable':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                                default:
                                                  return <td className="align-middle"></td>
                                              }
                                            })()}
                                            {(() => {
                                              let colorr = '#a6cb12';
                                              if (x.Bundle_x0020_2_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                              if (x.Bundle_x0020_2_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                              switch (x.Bundle_x0020_2_x0020_Trend) {
                                                case 'Trending up':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                                case 'Trending down':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                                case 'Stable':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                                default:
                                                  return <td className="align-middle"></td>
                                              }
                                            })()}
                                            {(() => {
                                              let colorr = '#a6cb12';
                                              if (x.Bundle_x0020_3_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                              if (x.Bundle_x0020_3_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                              switch (x.Bundle_x0020_3_x0020_Trend) {
                                                case 'Trending up':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                                case 'Trending down':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                                case 'Stable':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                                default:
                                                  return <td className="align-middle"></td>
                                              }
                                            })()}
                                            {(() => {
                                              let colorr = '#a6cb12';
                                              if (x.Bundle_x0020_4_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                              if (x.Bundle_x0020_4_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                              switch (x.Bundle_x0020_4_x0020_Trend) {
                                                case 'Trending up':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                                case 'Trending down':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                                case 'Stable':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                                default:
                                                  return <td className="align-middle"></td>
                                              }
                                            })()}
                                            {(() => {
                                              let colorr = '#a6cb12';
                                              if (x.Bundle_x0020_5_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                              if (x.Bundle_x0020_5_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                              switch (x.Bundle_x0020_5_x0020_Trend) {
                                                case 'Trending up':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                                case 'Trending down':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                                case 'Stable':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                                default:
                                                  return <td className="align-middle"></td>
                                              }
                                            })()}
                                            {(() => {
                                              let colorr = '#a6cb12';
                                              if (x.Bundle_x0020_7_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                              if (x.Bundle_x0020_7_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                              switch (x.Bundle_x0020_7_x0020_Trend) {
                                                case 'Trending up':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                                case 'Trending down':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                                case 'Stable':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                                default:
                                                  return <td className="align-middle"></td>
                                              }
                                            })()}
                                            {(() => {
                                              let colorr = '#a6cb12';
                                              if (x.Bundle_x0020_8_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                              if (x.Bundle_x0020_8_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                              switch (x.Bundle_x0020_8_x0020_Trend) {
                                                case 'Trending up':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                                case 'Trending down':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                                case 'Stable':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                                default:
                                                  return <td className="align-middle"></td>
                                              }
                                            })()}
                                            {(() => {
                                              let colorr = '#a6cb12';
                                              if (x.Change_x0020_and_x0020_Comms_x00 == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                              if (x.Change_x0020_and_x0020_Comms_x00 == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                              switch (x.Change_x0020_and_x0020_Comms_x000) {
                                                case 'Trending up':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                                case 'Trending down':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                                case 'Stable':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                                default:
                                                  return <td className="align-middle"></td>
                                              }
                                            })()}
                                            {(() => {
                                              let colorr = '#a6cb12';
                                              if (x.Overall_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                              if (x.Overall_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                              switch (x.Overall_x0020_Trend) {
                                                case 'Trending up':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                                case 'Trending down':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                                case 'Stable':
                                                  return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                                default:
                                                  return <td className="align-middle"></td>
                                              }
                                            })()}
                                            <td className="align-middle">{x.Created}</td>
                                          </tr>
                                        )
                                      })}

                                    </tbody>
                                  </table>
                                </div>
                              }
                            </div>
                          } </div>
                        <div>
                          {/* <img src={require('../images/novartis-logo-preview-image.png')} alt="test" /> */}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

        <div id="pdfGen" hidden style={{ backgroundColor: '#fff', padding: '20px' }}>
          <div className="container-fluid">
            <h2 className="text-center my-4">NBS {this.props.packageName} Progress Reports</h2>
            <div className="my-4">
              <span>
                <span className="px-2">
                  <a className="mr-1" style={{ color: '#bceb3c' }}>■</a>On Schedule
                                                   </span>
                <span className="px-2">
                  <a className="mr-1" style={{ color: '#f5a31a' }}>■</a>Minor Issues
                                                   </span>
                <span className="px-2">
                  <a className=" mr-1" style={{ color: '#f05d23' }}>■</a>Need Help
                                                   </span>
              </span>
              <span className="float-right">
                <span className="px-2">
                  <a className="mr-1" style={{ color: 'gray' }}> ▲</a>Trending Up
                                                   </span>
                <span className="px-2">
                  <a className="mr-1" style={{ color: 'gray' }}> ▶</a>Stable
                                                   </span>
                <span className="px-2">
                  <a className="mr-1" style={{ color: 'gray' }}>▼ </a>Trending down
                                                   </span>
              </span>
            </div>

            {this.state.isInitiative == false &&
              <div>
                {(type == '0' || type == '1') &&
                  <div className="table-resposive" >
                    <div style={{  height:'297mm' }}>
                    <table className="table table-bordered" id="tabAutoPaging">
                      <thead>
                        <tr className="bg-light text-center">
                          {this.props.type == '0' && <th className="text-center" scope="col" style={{ width: '25%' }}>Programs</th>}
                          {/* {this.props.type == '3' && <th scope="col" style={{ width: '25%' }}>NGSC</th>} */}
                          <th className="text-center" scope="col" style={{ width: '25%' }}>Initiative</th>
                          <th className="text-center" scope="col" style={{ width: '9%' }}>Scope</th>
                          <th className="text-center" scope="col" style={{ width: '9%' }}>Schedule</th>
                          <th className="text-center" scope="col" style={{ width: '9%' }}>Business case</th>
                          <th className="text-center" scope="col" style={{ width: '9%' }}>Communication & Comm.</th>
                          <th className="text-center" scope="col" style={{ width: '9%' }}>Impact on ops</th>
                          <th className="text-center" scope="col" style={{ width: '9%' }}>Overall</th>
                          <th className="text-center" scope="col" style={{ width: '14%' }}>Report Date</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {this.state.initiativeList.map((x: any) => {
                          return (
                            <tr>
                              {x.Status1 == true ? <td className="align-middle" rowSpan={x.Count}>{x.ProgramsId}</td> : ''}
                              <td className="text-left">{x.InitiativeId} </td>
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Scope_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Scope_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Scope_x0020_Trend) {
                                  case 'Trending up':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="align-middle"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Schedule_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Schedule_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Schedule_x0020_Trend) {
                                  case 'Trending up':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="align-middle"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Budget_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Budget_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Budget_x0020_Trend) {
                                  case 'Trending up':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="align-middle"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Change_x0020__x0026__x0020_Comms == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Change_x0020__x0026__x0020_Comms0) {
                                  case 'Trending up':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="align-middle"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Impact_x0020_On_x0020_Operations == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Impact_x0020_On_x0020_Operations0) {
                                  case 'Trending up':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="align-middle"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Overall_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Overall_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Overall_x0020_Trend) {
                                  case 'Trending up':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="align-middle"></td>
                                }
                              })()}
                              <td className="align-middle">{x.Created}</td>
                            </tr>
                          )
                        })}

                      </tbody>
                    </table>
                    </div>
                    <div>
                      {this.state.initiativeList.map((x: any) => {
                        // minHeight: '200rem',
                        return <div style={{  height:'297mm' }}>
                          <div className="row py-5">
                            <div className="col-6">
                              <h3>Date: {x.Created}</h3>
                              <h3>{programvalue}: {x.InitiativeId}</h3>
                            </div>
                            <div className="col-6 table-resposive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th scope="col" style={{ width: '25%' }}>Scope</th>
                                    <th scope="col" style={{ width: '25%' }}>Schedule</th>
                                    <th scope="col" style={{ width: '25%' }}>Business case</th>
                                    <th scope="col" style={{ width: '25%' }}>Change & Comms</th>
                                    <th scope="col" style={{ width: '25%' }}>Impact on ops</th>
                                    <th scope="col" style={{ width: '25%' }}>Overall</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    {(() => {
                                      let colorr = '#a6cb12';
                                      if (x.Scope_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                      if (x.Scope_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                      switch (x.Scope_x0020_Trend) {
                                        case 'Trending up':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                        case 'Trending down':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                        case 'Stable':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                        default:
                                          return <td className="text-center"></td>
                                      }
                                    })()}
                                    {(() => {
                                      let colorr = '#a6cb12';
                                      if (x.Schedule_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                      if (x.Schedule_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                      switch (x.Schedule_x0020_Trend) {
                                        case 'Trending up':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                        case 'Trending down':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                        case 'Stable':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                        default:
                                          return <td className="text-center"></td>
                                      }
                                    })()}
                                    {(() => {
                                      let colorr = '#a6cb12';
                                      if (x.Budget_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                      if (x.Budget_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                      switch (x.Budget_x0020_Trend) {
                                        case 'Trending up':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                        case 'Trending down':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                        case 'Stable':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                        default:
                                          return <td className="text-center"></td>
                                      }
                                    })()}
                                    {(() => {
                                      let colorr = '#a6cb12';
                                      if (x == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                      if (x.Change_x0020__x0026__x0020_Comms == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                      switch (x.Change_x0020__x0026__x0020_Comms0) {
                                        case 'Trending up':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                        case 'Trending down':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                        case 'Stable':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                        default:
                                          return <td className="text-center"></td>
                                      }
                                    })()}
                                    {(() => {
                                      let colorr = '#a6cb12';
                                      if (x == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                      if (x.Impact_x0020_On_x0020_Operations == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                      switch (x.Impact_x0020_On_x0020_Operations0) {
                                        case 'Trending up':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                        case 'Trending down':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                        case 'Stable':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                        default:
                                          return <td className="text-center"></td>
                                      }
                                    })()}
                                    {(() => {
                                      let colorr = '#a6cb12';
                                      if (x.Overall_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                      if (x.Overall_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                      switch (x.Overall_x0020_Trend) {
                                        case 'Trending up':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                        case 'Trending down':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                        case 'Stable':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                        default:
                                          return <td className="text-center"></td>
                                      }
                                    })()}
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div>
                            <h4>Key Achievements in Period</h4>
                            <div style={{ border: '1px solid black', width: '100%', padding: '5px' }}>
                              {Parser(x.Key_x0020_Achievements)}
                            </div>
                          </div>
                          <div>
                            <h4>Key Activities in Next Period</h4>
                            <div style={{ border: '1px solid black', width: '100%', padding: '5px' }}>
                              {Parser(x.Key_x0020_Activities_x0020_for_x)}
                            </div>
                          </div>
                          <div>
                            <h4>Support / Attention Needed</h4>
                            <div style={{ border: '1px solid black', width: '100%', padding: '5px' }}>
                              {Parser(x.Support_x0020__x002f__x0020_Atte)}
                            </div>
                          </div>
                        </div>
                      })}
                    </div>
                  </div>
                }
                {(type == '2' || type == '3') &&
                  <div className="table-resposive">
                     <div style={{  height:'297mm' }}>
                    <table className="table table-bordered" id="tabAutoPaging">
                      <thead>
                        <tr className="bg-light">
                          {this.props.type == '3' && <th className="text-center" scope="col" style={{ width: '18%' }}>NGSC Country</th>}
                          {this.props.type == '2' && <th className="text-center" scope="col" style={{ width: '18%' }}>Country</th>}
                          <th className="text-center" scope="col" style={{ width: '8%' }}>Bundle 1</th>
                          <th className="text-center" scope="col" style={{ width: '8%' }}>Bundle 2</th>
                          <th className="text-center" scope="col" style={{ width: '8%' }}>Bundle 3</th>
                          <th className="text-center" scope="col" style={{ width: '8%' }}>Bundle 4</th>
                          <th className="text-center" scope="col" style={{ width: '8%' }}>Bundle 5</th>
                          <th className="text-center" scope="col" style={{ width: '8%' }}>Bundle 7</th>
                          <th className="text-center" scope="col" style={{ width: '8%' }}>Bundle 8</th>
                          <th className="text-center" scope="col" style={{ width: '8%' }}>Change and Comms</th>
                          <th className="text-center" scope="col" style={{ width: '8%' }}>Overall</th>
                          <th className="text-center" scope="col" style={{ width: '10%' }}>Report Date</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {this.state.initiativeList.map((x: any) => {
                          return (
                            <tr>

                              {this.props.type == '3' && <td className="text-left">{x.Country_x002f_ClusterId}</td>}
                              {this.props.type == '2' && <td className="text-left">{x.CountryId}</td>}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Bundle_x0020_1_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Bundle_x0020_1_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Bundle_x0020_1_x0020_Trend) {
                                  case 'Trending up':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="align-middle"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Bundle_x0020_2_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Bundle_x0020_2_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Bundle_x0020_2_x0020_Trend) {
                                  case 'Trending up':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="align-middle"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Bundle_x0020_3_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Bundle_x0020_3_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Bundle_x0020_3_x0020_Trend) {
                                  case 'Trending up':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="align-middle"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Bundle_x0020_4_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Bundle_x0020_4_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Bundle_x0020_4_x0020_Trend) {
                                  case 'Trending up':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="align-middle"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Bundle_x0020_5_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Bundle_x0020_5_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Bundle_x0020_5_x0020_Trend) {
                                  case 'Trending up':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="align-middle"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Bundle_x0020_7_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Bundle_x0020_7_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Bundle_x0020_7_x0020_Trend) {
                                  case 'Trending up':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="align-middle"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Bundle_x0020_8_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Bundle_x0020_8_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Bundle_x0020_8_x0020_Trend) {
                                  case 'Trending up':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="align-middle"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Change_x0020_and_x0020_Comms_x00 == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Change_x0020_and_x0020_Comms_x00 == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Change_x0020_and_x0020_Comms_x000) {
                                  case 'Trending up':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="align-middle"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Overall_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Overall_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Overall_x0020_Trend) {
                                  case 'Trending up':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="align-middle" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="align-middle"></td>
                                }
                              })()}
                              <td className="align-middle">{x.Created}</td>
                            </tr>
                          )
                        })}

                      </tbody>
                    </table>
                   </div>
                    <div>
                      {this.state.initiativeList.map((x: any) => {
                        return <div style={{  height:'297mm' }}>
                          <div className="row py-5">
                            <div className="col-6">
                              <h3>Date: {x.Created}</h3>
                              {this.props.type == '2' && <h3>{programvalue}: {x.CountryId}</h3>}
                              {this.props.type == '3' && <h3>{programvalue}: {x.Country_x002f_ClusterId}</h3>}
                            </div>
                            <div className="col-6 table-resposive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th scope="col" style={{ width: '10%' }}>Bundle 1</th>
                                    <th scope="col" style={{ width: '10%' }}>Bundle 2</th>
                                    <th scope="col" style={{ width: '10%' }}>Bundle 3</th>
                                    <th scope="col" style={{ width: '10%' }}>Bundle 4</th>
                                    <th scope="col" style={{ width: '10%' }}>Bundle 5</th>
                                    <th scope="col" style={{ width: '10%' }}>Bundle 7</th>
                                    <th scope="col" style={{ width: '10%' }}>Bundle 8</th>
                                    <th scope="col" style={{ width: '10%' }}>Change and Comms</th>
                                    <th scope="col" style={{ width: '10%' }}>Overall</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    {(() => {
                                      let colorr = '#a6cb12';
                                      if (x.Bundle_x0020_1_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                      if (x.Bundle_x0020_1_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                      switch (x.Bundle_x0020_1_x0020_Trend) {
                                        case 'Trending up':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                        case 'Trending down':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                        case 'Stable':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                        default:
                                          return <td className="text-center"></td>
                                      }
                                    })()}
                                    {(() => {
                                      let colorr = '#a6cb12';
                                      if (x.Bundle_x0020_2_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                      if (x.Bundle_x0020_2_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                      switch (x.Bundle_x0020_2_x0020_Trend) {
                                        case 'Trending up':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                        case 'Trending down':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                        case 'Stable':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                        default:
                                          return <td className="text-center"></td>
                                      }
                                    })()}
                                    {(() => {
                                      let colorr = '#a6cb12';
                                      if (x.Bundle_x0020_3_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                      if (x.Bundle_x0020_3_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                      switch (x.Bundle_x0020_3_x0020_Trend) {
                                        case 'Trending up':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                        case 'Trending down':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                        case 'Stable':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                        default:
                                          return <td className="text-center"></td>
                                      }
                                    })()}
                                    {(() => {
                                let colorr = '#a6cb12';
                                if (x.Bundle_x0020_4_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Bundle_x0020_4_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Bundle_x0020_4_x0020_Trend) {
                                  case 'Trending up':
                                    return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="text-center"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Bundle_x0020_5_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Bundle_x0020_5_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Bundle_x0020_5_x0020_Trend) {
                                  case 'Trending up':
                                    return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="text-center"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Bundle_x0020_7_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Bundle_x0020_7_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Bundle_x0020_7_x0020_Trend) {
                                  case 'Trending up':
                                    return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="text-center"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Bundle_x0020_8_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Bundle_x0020_8_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Bundle_x0020_8_x0020_Trend) {
                                  case 'Trending up':
                                    return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="text-center"></td>
                                }
                              })()}
                              {(() => {
                                let colorr = '#a6cb12';
                                if (x.Change_x0020_and_x0020_Comms_x00 == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                if (x.Change_x0020_and_x0020_Comms_x00 == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                switch (x.Change_x0020_and_x0020_Comms_x000) {
                                  case 'Trending up':
                                    return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                  case 'Trending down':
                                    return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                  case 'Stable':
                                    return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                  default:
                                    return <td className="text-center"></td>
                                }
                              })()}
                                    {(() => {
                                      let colorr = '#a6cb12';
                                      if (x.Overall_x0020_Status == 'Minor issues threatening schedule and / or goals') colorr = '#f5a31a';
                                      if (x.Overall_x0020_Status == 'Behind schedule and/or goals are risk') colorr = '#f05d23';
                                      switch (x.Overall_x0020_Trend) {
                                        case 'Trending up':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▲</td>
                                        case 'Trending down':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▼</td>
                                        case 'Stable':
                                          return <td className="text-center" style={{ backgroundColor: colorr, color: 'White' }}>▶</td>
                                        default:
                                          return <td className="text-center"></td>
                                      }
                                    })()}
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div>
                            <h4>Key Achievements in Period</h4>
                            <div style={{ border: '1px solid black', width: '100%', padding: '5px' }}>
                              {Parser(x.Key_x0020_Achievements_x0020_in_)}
                            </div>
                          </div>
                          <div>
                            <h4>Key Activities in Next Period</h4>
                            <div style={{ border: '1px solid black', width: '100%', padding: '5px' }}>
                              {Parser(x.Key_x0020_Activities_x0020_for_x)}
                            </div>
                          </div>
                          <div>
                            <h4>Support / Attention Needed</h4>
                            <div style={{ border: '1px solid black', width: '100%', padding: '5px' }}>
                              {Parser(x.Support_x0020__x002f__x0020_Atte)}
                            </div>
                          </div>
                        </div>
                      })}
                    </div>
                  </div>
                }
              </div>
            }
          </div>

        </div>

      </LoadingOverlay>
    )
  }
  private _getselectedItem(): string {
    return 'Select Program';
  }

  getInitiative(value) {
    let val;
    if (this.props.type == '2') {
      val = this.state.allInitiativeList.filter(x => x.CountryId == value)
    }
    else if (this.props.type == '3') {
      val = this.state.allInitiativeList.filter(x => x.Country_x002f_ClusterId == value)
    }
    else {
      val = this.state.allInitiativeList.filter(x => x.InitiativeId == value)
    }
    this.setState({
      selectedInitiative: val[0],
      isInitiative: true
    });
  }
  getInitiative1 = (event) => {
    this._spops.getTrends(this.props.context, event.target.value, 1).then((result: any) => {
      console.log('get initiative1', result);
      setTimeout(() => {
        this.setState({
          selectedInitiative: result,
          isInitiative: true
        })
      }, 600);
    })
  }

  public generatePPT = () => {
    // this.createNotification('success');
    // // 1. Create a new Presentation
    let pptx = new pptxgen();
    pptx.defineLayout({ name: 'A3', width: 22, height: 15 });
    // // 2. Add a Slide
    let slide = pptx.addSlide('slideone');
    let textboxOpts = { x: 0.4, y: 0.2, color: "363636", fontSize: 24, fontFace: 'Arial black', bold: true, align: pptx.AlignH.left };
    let textboxText = "";
    var rows = [];
    rows.push([{ text: 'Initiative', options: { align: "center", bold: true } }, { text: 'Scope', options: { align: "center", bold: true } }, { text: 'Schedule', options: { align: "center", bold: true } }, { text: 'Business case', options: { align: "center", bold: true } }, { text: 'Overall Status', options: { align: "center", bold: true } }, { text: 'Last Reported Date', options: { align: "center", bold: true } }]);
    this.state.initiativeList.map((x: any) => {
      if (this.props.type == '0') { textboxText = x.ProgramsId; }
      let clr1 = 'a6cb12'; let clr2 = 'a6cb12'; let clr3 = 'a6cb12'; let clr4 = 'a6cb12';
      if (x.Scope_x0020_Status == 'Behind schedule and/or goals are risk') { clr1 = 'f05d23'; }
      if (x.Scope_x0020_Status == 'Minor issues threatening schedule and / or goals') { clr1 = 'f5a31a'; }

      if (x.Schedule_x0020_Status == 'Behind schedule and/or goals are risk') { clr1 = 'f05d23'; }
      if (x.Schedule_x0020_Status == 'Minor issues threatening schedule and / or goals') { clr1 = 'f5a31a'; }

      if (x.Budget_x0020_Status == 'Behind schedule and/or goals are risk') { clr1 = 'f05d23'; }
      if (x.Budget_x0020_Status == 'Minor issues threatening schedule and / or goals') { clr1 = 'f5a31a'; }

      if (x.OveralStatus == 'Behind schedule and/or goals are risk') { clr1 = 'f05d23'; }
      if (x.OveralStatus == 'Minor issues threatening schedule and / or goals') { clr1 = 'f5a31a'; }

      rows.push([
        { text: x.InitiativeId, options: { w: 4 } },
        { text: '▶', options: { Color: "black", fill: clr1, valign: "center", align: "center" } },
        { text: '▶', options: { Color: "black", fill: clr2, valign: "center", align: "center" } },
        { text: '▶', options: { Color: "black", fill: clr3, valign: "center", align: "center" } },
        { text: '▶', options: { Color: "black", fill: clr4, valign: "center", align: "center" } },
        { text: x.Created, options: { Color: "black", valign: "center", align: "center" } },
      ]);
    })
    slide.addText(textboxText, textboxOpts);
    slide.addTable(rows, { x: 0.5, y: 1.0, w: 10.0, colW: [3.0, 1.0, 1.0, 1.0, 1.0, 2.0], fill: { color: 'e1e1e1' } });
    slide.addImage({ path: require('../images/novartis-logo-preview-image.png'), x: 6.0, y: 5, w: 3.5, h: 0.5 });
    this.state.initiativeList.map((x: any) => {
      this.testMethod_Table(pptx, x, textboxOpts);
    })

    // this.testMethod_Chart(pptx);
    pptx.writeFile("progres-report.pptx");
  }
  testMethod_Table(pptx: pptxgen, item: any, options1: any) {
    console.log(item);
    const slidee = pptx.addSlide('slideone');
    slidee.addText(item.InitiativeId, options1);
    const rows = [];
    const rows2 = [];
    const rows3 = [];
    const rows4 = [];
    let clr1 = 'a6cb12'; let clr2 = 'a6cb12'; let clr3 = 'a6cb12'; let clr4 = 'a6cb12';
    if (item.Scope_x0020_Status == 'Behind schedule and/or goals are risk') { clr1 = 'f05d23'; }
    if (item.Scope_x0020_Status == 'Minor issues threatening schedule and / or goals') { clr1 = 'f5a31a'; }

    if (item.Schedule_x0020_Status == 'Behind schedule and/or goals are risk') { clr1 = 'f05d23'; }
    if (item.Schedule_x0020_Status == 'Minor issues threatening schedule and / or goals') { clr1 = 'f5a31a'; }

    if (item.Budget_x0020_Status == 'Behind schedule and/or goals are risk') { clr1 = 'f05d23'; }
    if (item.Budget_x0020_Status == 'Minor issues threatening schedule and / or goals') { clr1 = 'f5a31a'; }

    if (item.OveralStatus == 'Behind schedule and/or goals are risk') { clr1 = 'f05d23'; }
    if (item.OveralStatus == 'Minor issues threatening schedule and / or goals') { clr1 = 'f5a31a'; }

    rows.push([{ text: "Scope", options: { align: "center", bold: true } }, { text: "Schedule", options: { align: "center", bold: true } }, { text: "Chang & Comms", options: { align: "center", bold: true } }, { text: "Overall Status", options: { align: "center", bold: true } }]);
    rows.push([
      { text: '▶', options: { Color: "black", fill: clr1, align: "center" } },
      { text: '▶', options: { Color: "black", fill: clr2, align: "center" } },
      { text: '▶', options: { Color: "black", fill: clr3, align: "center" } },
      { text: '▶', options: { Color: "black", fill: clr4, align: "center" } },
    ]);
    slidee.addTable(rows, { x: 5.5, y: 0.0, w: 4, h: 0.5, fill: { color: 'e1e1e1' } });
    console.log('count', item.Key_x0020_Achievements.length, item.Key_x0020_Activities_x0020_for_x.length, item.Support_x0020__x002f__x0020_Atte.length);
    if ((item.Key_x0020_Achievements.length > 600 || item.Key_x0020_Activities_x0020_for_x.length > 600) || item.Support_x0020__x002f__x0020_Atte.length > 200) {
      console.log('if  called');
      const rows14 = [];
      const rows24 = [];
      const rows34 = [];
      slidee.addText("Key Achievements in Period : ", { x: 0.4, y: 1.1, color: "388df6", fontSize: 10, fontFace: 'Arial' });
      rows14.push([
        { text: item.Key_x0020_Achievements.replace(/<[^>]+>/g, '').replace(/&#?[a-z0-9]+;/g, " ").replace("&#8203;", ''), options: { fontSize: 10, fontFace: 'Arial' } }
      ]);
      slidee.addTable(rows14, { x: 0.5, y: 1.4, color: "363636", fill: { color: 'e1e1e1' } });

      const slidee1 = pptx.addSlide('slidetwo');
      slidee1.addText("Key Activities in Next Period :", { x: 0.4, y: 0.0, color: "388df6", fontSize: 10, fontFace: 'Arial' });
      rows24.push([
        { text: item.Key_x0020_Activities_x0020_for_x.replace(/<[^>]+>/g, '').replace(/&#?[a-z0-9]+;/g, " ").replace("&#8203;", ''), options: { fontSize: 10, fontFace: 'Arial' } }
      ]);
      slidee1.addTable(rows24, { x: 0.5, y: 0.5, color: "363636", fill: { color: 'e1e1e1' } });

      const slidee2 = pptx.addSlide('slidethree');
      slidee2.addText("Support / Attention Needed : ", { x: 0.4, y: 0.0, color: "388df6", fontSize: 10, fontFace: 'Arial' });
      rows34.push([
        { text: item.Support_x0020__x002f__x0020_Atte.replace(/<[^>]+>/g, '').replace(/&#?[a-z0-9]+;/g, " ").replace("&#8203;", ''), options: { fontSize: 10, fontFace: 'Arial' } }
      ]);
      slidee2.addTable(rows34, { x: 0.5, y: 0.5, color: "363636", fill: { color: 'e1e1e1' } });
      slidee1.addImage({ path: require('../images/novartis-logo-preview-image.png'), x: 6.0, y: 5, w: 3.5, h: 0.5 });
      slidee2.addImage({ path: require('../images/novartis-logo-preview-image.png'), x: 6.0, y: 5, w: 3.5, h: 0.5 });
    }
    else {
      console.log('else called');
      slidee.addText("Key Achievements in Period", { x: 0.4, y: 1.2, color: "388df6", fontSize: 10, fontFace: 'Arial' });
      slidee.addText("Key Activities in Next Period", { x: 5.0, y: 1.2, color: "388df6", fontSize: 10, fontFace: 'Arial' });
      rows2.push([
        { text: item.Key_x0020_Achievements.replace(/<[^>]+>/g, '').replace(/&#?[a-z0-9]+;/g, " ").replace("&#8203;", ''), options: { fontSize: 10, fontFace: "Arial" } }
      ]);
      rows3.push([
        { text: item.Key_x0020_Activities_x0020_for_x.replace(/<[^>]+>/g, '').replace(/&#?[a-z0-9]+;/g, " ").replace("&#8203;", ''), options: { fontSize: 10, fontFace: "Arial" } }
      ]);
      slidee.addTable(rows2, { x: 0.5, y: 1.5, h: 2, w: 4.3, color: "363636", fill: { color: 'e1e1e1' } });
      slidee.addTable(rows3, { x: 5.1, y: 1.5, h: 2, w: 4.4, color: "363636", fill: { color: 'e1e1e1' } });

      slidee.addText("Support / Attention Needed", { x: 0.4, y: 3.7, color: "388df6", fontSize: 10, fontFace: 'Arial' });
      rows4.push([
        { text: item.Support_x0020__x002f__x0020_Atte.replace(/<[^>]+>/g, '').replace(/&#?[a-z0-9]+;/g, " ").replace("&#8203;", ''), options: { fontSize: 10, fontFace: 'Arial' } }
      ]);
      slidee.addTable(rows4, { x: 0.5, y: 4.0, color: "363636", fill: { color: 'e1e1e1' } });
    }

    slidee.addImage({ path: require('../images/novartis-logo-preview-image.png'), x: 6.0, y: 5, w: 3.5, h: 0.5 });
  }


  public generatePPT1 = () => {
    // this.createNotification('success');
    // // 1. Create a new Presentation
    let pptx = new pptxgen();
    pptx.defineLayout({ name: 'A3', width: 22, height: 15 });
    // // 2. Add a Slide
    let slide = pptx.addSlide('slideone');
    let textboxOpts = { x: 0.4, y: 0.2, color: "363636", fontSize: 24, fontFace: 'Arial black', bold: true, align: pptx.AlignH.left };
    let textboxText = "";
    var rows = [];
    rows.push([{ text: 'Country', options: { align: "center", bold: true } }, { text: 'Bundle 1', options: { align: "center", bold: true } }, { text: 'Bundle 2', options: { align: "center", bold: true } }, { text: 'Business case', options: { align: "center", bold: true } }, { text: 'Overall Status', options: { align: "center", bold: true } }, { text: 'Last Reported Date', options: { align: "center", bold: true } }]);
    this.state.initiativeList.map((x: any) => {
      if (this.props.type == '2') { textboxText = x.CountryId; }
      else { textboxText = x.NGSCId; }
      let clr1 = 'a6cb12'; let clr2 = 'a6cb12'; let clr3 = 'a6cb12'; let clr4 = 'a6cb12';
      if (x.Bundle_x0020_1_x0020_Status == 'Behind schedule and/or goals are risk') { clr1 = 'f05d23'; }
      if (x.Bundle_x0020_1_x0020_Status == 'Minor issues threatening schedule and / or goals') { clr1 = 'f5a31a'; }

      if (x.Bundle_x0020_2_x0020_Status == 'Behind schedule and/or goals are risk') { clr1 = 'f05d23'; }
      if (x.Bundle_x0020_2_x0020_Status == 'Minor issues threatening schedule and / or goals') { clr1 = 'f5a31a'; }

      if (x.Bundle_x0020_3_x0020_Status == 'Behind schedule and/or goals are risk') { clr1 = 'f05d23'; }
      if (x.Bundle_x0020_3_x0020_Status == 'Minor issues threatening schedule and / or goals') { clr1 = 'f5a31a'; }

      if (x.Overall_x0020_Status == 'Behind schedule and/or goals are risk') { clr1 = 'f05d23'; }
      if (x.Overall_x0020_Status == 'Minor issues threatening schedule and / or goals') { clr1 = 'f5a31a'; }

      if (this.props.type == '2') {
        rows.push([
          { text: x.CountryId, options: { w: 4 } },
          { text: '▶', options: { Color: "black", fill: clr1, valign: "center", align: "center" } },
          { text: '▶', options: { Color: "black", fill: clr2, valign: "center", align: "center" } },
          { text: '▶', options: { Color: "black", fill: clr3, valign: "center", align: "center" } },
          { text: '▶', options: { Color: "black", fill: clr4, valign: "center", align: "center" } },
          { text: x.Created, options: { Color: "black", valign: "center", align: "center" } },
        ]);
      } else {
        rows.push([
          { text: x.Country_x002f_ClusterId, options: { w: 4 } },
          { text: '▶', options: { Color: "black", fill: clr1, valign: "center", align: "center" } },
          { text: '▶', options: { Color: "black", fill: clr2, valign: "center", align: "center" } },
          { text: '▶', options: { Color: "black", fill: clr3, valign: "center", align: "center" } },
          { text: '▶', options: { Color: "black", fill: clr4, valign: "center", align: "center" } },
          { text: x.Created, options: { Color: "black", valign: "center", align: "center" } },
        ]);
      }

    })
    slide.addText(textboxText, textboxOpts);
    slide.addTable(rows, { x: 0.5, y: 1.0, w: 10.0, colW: [3.0, 1.0, 1.0, 1.0, 1.0, 2.0], fill: { color: 'e1e1e1' } });
    slide.addImage({ path: require('../images/novartis-logo-preview-image.png'), x: 6.0, y: 5, w: 3.5, h: 0.5 });
    this.state.initiativeList.map((x: any) => {
      this.testMethod_Table1(pptx, x, textboxOpts);
    })

    // this.testMethod_Chart(pptx);
    pptx.writeFile("progres-report.pptx");
  }
  testMethod_Table1(pptx: pptxgen, item: any, options1: any) {
    console.log(item);
    const slidee = pptx.addSlide('slideone');
    if (this.props.type == '2') slidee.addText(item.CountryId, options1);
    if (this.props.type == '3') slidee.addText(item.Country_x002f_ClusterId, options1);
    const rows = [];
    const rows2 = [];
    const rows3 = [];
    const rows4 = [];
    let clr1 = 'a6cb12'; let clr2 = 'a6cb12'; let clr3 = 'a6cb12'; let clr4 = 'a6cb12';
    if (item.Bundle_x0020_1_x0020_Status == 'Behind schedule and/or goals are risk') { clr1 = 'f05d23'; }
    if (item.Bundle_x0020_1_x0020_Status == 'Minor issues threatening schedule and / or goals') { clr1 = 'f5a31a'; }

    if (item.Bundle_x0020_2_x0020_Status == 'Behind schedule and/or goals are risk') { clr1 = 'f05d23'; }
    if (item.Bundle_x0020_2_x0020_Status == 'Minor issues threatening schedule and / or goals') { clr1 = 'f5a31a'; }

    if (item.Bundle_x0020_3_x0020_Status == 'Behind schedule and/or goals are risk') { clr1 = 'f05d23'; }
    if (item.Bundle_x0020_3_x0020_Status == 'Minor issues threatening schedule and / or goals') { clr1 = 'f5a31a'; }

    if (item.Overall_x0020_Status == 'Behind schedule and/or goals are risk') { clr1 = 'f05d23'; }
    if (item.Overall_x0020_Status == 'Minor issues threatening schedule and / or goals') { clr1 = 'f5a31a'; }
    rows.push([{ text: "Bundle 1", options: { align: "center", bold: true } }, { text: "Bundle 2", options: { align: "center", bold: true } }, { text: "Bundle 3", options: { align: "center", bold: true } }, { text: "Overall Status", options: { align: "center", bold: true } }]);
    rows.push([
      { text: '▶', options: { Color: "black", fill: clr1, align: "center" } },
      { text: '▶', options: { Color: "black", fill: clr2, align: "center" } },
      { text: '▶', options: { Color: "black", fill: clr3, align: "center" } },
      { text: '▶', options: { Color: "black", fill: clr4, align: "center" } },
    ]);
    slidee.addTable(rows, { x: 5.5, y: 0.0, w: 4, h: 0.5, fill: { color: 'e1e1e1' } });

    if ((item.Key_x0020_Achievements_x0020_in_.length > 600 || item.Key_x0020_Activities_x0020_for_x.length > 600) || item.Support_x0020__x002f__x0020_Atte.length > 200) {
      console.log('if  called');
      const rows14 = [];
      const rows24 = [];
      const rows34 = [];
      slidee.addText("Key Achievements in Period : ", { x: 0.4, y: 1.1, color: "388df6", fontSize: 10, fontFace: 'Arial' });
      rows14.push([
        { text: item.Key_x0020_Achievements_x0020_in_.replace(/<[^>]+>/g, '').replace(/&#?[a-z0-9]+;/g, " ").replace("&#8203;", ''), options: { fontSize: 10, fontFace: 'Arial' } }
      ]);
      slidee.addTable(rows14, { x: 0.5, y: 1.4, color: "363636", fill: { color: 'e1e1e1' } });

      const slidee1 = pptx.addSlide('slidetwo');
      slidee1.addText("Key Activities in Next Period :", { x: 0.4, y: 0.0, color: "388df6", fontSize: 10, fontFace: 'Arial' });
      rows24.push([
        { text: item.Key_x0020_Activities_x0020_for_x.replace(/<[^>]+>/g, '').replace(/&#?[a-z0-9]+;/g, " ").replace("&#8203;", ''), options: { fontSize: 10, fontFace: 'Arial' } }
      ]);
      slidee1.addTable(rows24, { x: 0.5, y: 0.5, color: "363636", fill: { color: 'e1e1e1' } });

      const slidee2 = pptx.addSlide('slidethree');
      slidee2.addText("Support / Attention Needed : ", { x: 0.4, y: 0.0, color: "388df6", fontSize: 10, fontFace: 'Arial' });
      rows34.push([
        { text: item.Support_x0020__x002f__x0020_Atte.replace(/<[^>]+>/g, '').replace(/&#?[a-z0-9]+;/g, " ").replace("&#8203;", ''), options: { fontSize: 10, fontFace: 'Arial' } }
      ]);
      slidee2.addTable(rows34, { x: 0.5, y: 0.5, color: "363636", fill: { color: 'e1e1e1' } });
      slidee1.addImage({ path: require('../images/novartis-logo-preview-image.png'), x: 6.0, y: 5, w: 3.5, h: 0.5 });
      slidee2.addImage({ path: require('../images/novartis-logo-preview-image.png'), x: 6.0, y: 5, w: 3.5, h: 0.5 });
    }
    else {
      slidee.addText("Key Achievements in Period", { x: 0.4, y: 1.2, color: "388df6", fontSize: 10, fontFace: 'Arial' });
      slidee.addText("Key Activities in Next Period", { x: 5.0, y: 1.2, color: "388df6", fontSize: 10, fontFace: 'Arial' });
      rows2.push([
        { text: item.Key_x0020_Achievements_x0020_in_.replace(/<[^>]+>/g, '').replace(/&#?[a-z0-9]+;/g, " ").replace("&#8203;", ''), options: { fontSize: 10, fontFace: "Arial" } }
      ]);
      rows3.push([
        { text: item.Key_x0020_Activities_x0020_for_x.replace(/<[^>]+>/g, '').replace(/&#?[a-z0-9]+;/g, " ").replace("&#8203;", ''), options: { fontSize: 10, fontFace: "Arial" } }
      ]);
      slidee.addTable(rows2, { x: 0.5, y: 1.5, h: 2, w: 4.3, color: "363636", fill: { color: 'e1e1e1' } });
      slidee.addTable(rows3, { x: 5.1, y: 1.5, h: 2, w: 4.4, color: "363636", fill: { color: 'e1e1e1' } });

      slidee.addText("Support / Attention Needed", { x: 0.4, y: 3.7, color: "388df6", fontSize: 10, fontFace: 'Arial' });
      rows4.push([
        { text: item.Support_x0020__x002f__x0020_Atte.replace(/<[^>]+>/g, '').replace(/&#?[a-z0-9]+;/g, " ").replace("&#8203;", ''), options: { fontSize: 10, fontFace: 'Arial' } }
      ]);
      slidee.addTable(rows4, { x: 0.5, y: 4.0, color: "363636", fill: { color: 'e1e1e1' } });
    }

    slidee.addImage({ path: require('../images/novartis-logo-preview-image.png'), x: 6.0, y: 5, w: 3.5, h: 0.5 });
  }
}
