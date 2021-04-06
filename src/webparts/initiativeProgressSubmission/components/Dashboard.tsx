import * as React from 'react';
import { ModalBasicExample } from '../components/AddNewModal';
import { IInitiativeProgressSubmissionProps } from '../models/IInitiativeProgressSubmissionProps';
import styles from './styles.module.scss';
import { Label, Dropdown, Icon } from 'office-ui-fabric-react';
import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { Crudoperations } from '../services/SPServices';
import { ISubmission } from '../models/ISubmission';
import { IDashboardState } from '../models/IDashboardState';
import * as Chart from 'chart.js';
import { render } from 'react-dom';
import { Analysis, Status, Trend } from '../models/Analysis';

import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Link } from 'office-ui-fabric-react/lib/Link';

const modelProps = {
  isBlocking: true,
  styles: { main: { maxWidth: 900 } },
};
const dialogContentProps = {
  type: DialogType.normal,
};


export class Dashboard extends React.Component<IInitiativeProgressSubmissionProps, IDashboardState, {}>{
  public _spops: Crudoperations;
  private _selection: Selection;
  chartref: React.RefObject<ChartControl>;


  constructor(props: IInitiativeProgressSubmissionProps) {
    super(props);
    this._spops = new Crudoperations(this.props);
    this.state = {
      listitems: [],
      onschedulecnt: 0,
      minorissuescnt: 0,
      behindschedulecnt: 0,
      _data: {},
      datasetdata: [],
      analysis: new Analysis(),
      prgm: '',
      needAttention: [],
      hideDialog: true,
      attentionOne: {},
      selectedItem: this._getselectedItem(),
      trendData: {}
    };
    this.getchartdata = this.getchartdata.bind(this);
    this.chartref = React.createRef();
  }
  private _getselectedItem(): string {
    const selectionCount = this.props.Programs[0].text;
    setTimeout(() => {
      this._spops.getinitiativeitems(this.props.context, selectionCount)
        .then((result: Analysis) => {
          console.log('default event ', result);
          this.setState({
            prgm: selectionCount,
            analysis: result
          }, () => {
            this.chartref.current.renderChart({});
          });
        });
    }, 1000);
    return selectionCount;
  }
  public getchartdata = (event: any, result: any) => {
    let prgm = result.key;
    console.log('resultt', result);
    this._spops.getinitiativeitems(this.props.context, prgm)
      .then((result: Analysis) => {
        setTimeout(() => {
          console.log('tessstttt', result);
          this.setState({
            prgm: prgm,
            analysis: result
          }, () => {
            this.chartref.current.renderChart({});
          });
        }, 1000);
      });
  }

  public componentDidMount() {

    // this._spops.needAttentionList(this.props.context)
    //     .then((result) => {
    //         setTimeout(() => {
    //             console.log('getRecentInitiative', result);
    //             this.setState({
    //                 needAttention: result
    //             })
    //         }, 1000);
    //     });
  }
  private _loadAsyncData(value, Id): Promise<Chart.ChartData> {
    return new Promise<Chart.ChartData>((resolve, reject) => {
      if (this.state.prgm == "") {
        setTimeout(() => {
          var data: Chart.ChartData;
          if (Id == 1) data = new Status();
          else data = new Trend();
          resolve(data);
        }, 400);

      } else {
        setTimeout(() => {
          const data: Chart.ChartData = value;
          resolve(data);
        }, 800);
      }

    });
  }
  private _loadTrendData(value): Promise<Chart.ChartData> {
    console.log('loadtrenddata', value);
    return new Promise<Chart.ChartData>((resolve, reject) => {
      if (this.state.prgm == "") {
        console.log('if');
      } else {
        setTimeout(() => {
          let data2: Chart.ChartData = {
            labels: value.Dates,
            datasets: [
              {
                label: 'Trend Analysis',
                fill: false,
                data: value.Counts,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgb(255, 99, 132)",
                borderWidth: 1
              }
            ]
          };
          resolve(data2);
        }, 800);
      }
    });
  }
  private loadAttention = (event, x) => {
    console.log('event xxxxxx', event);
    if (x != this.state.attentionOne) {
      this.setState({
        attentionOne: x,
        hideDialog: false
      })
    }
  }
  private _trendAnalysis = (event) => {
    console.log('trenddd', event.target.value);
    this._spops.getTrends(this.props.context, event.target.value, 3).then((result: any) => {
      console.log('get trends', result);

      setTimeout(() => {
        this.setState({
          trendData: result
        })
      }, 600);
    })
  }
  public render(): React.ReactElement {
    console.log('this.state.hideDialog', this.state.hideDialog);

    const options: Chart.ChartOptions = {
      legend: {
        display: false
      }
    };
    const options1: Chart.ChartOptions = {
      legend: {
        display: true,
        position: "right"
      }
    };
    const data2: Chart.ChartData = {
      labels:
        [
          'July1', 'July2', 'July3', 'July4'
        ],
      datasets: [
        {
          label: 'Trending up',
          fill: "start",
          lineTension: 0,
          data:
            [
              12, 20, 70, 120
            ],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgb(255, 99, 132)",
          borderWidth: 1
        }
      ]
    };
    // set the options
    const options2: Chart.ChartOptions = {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Deliver Transformative Innovation : NBS X"
      }
    };
    return (
      <div >

        <div className={styles.contianer}>

          <div className="row">
            <div className="col-7 pr-0">
              <div className={styles.ReportsSection}>
                {/* <div className={styles.StatsContainer}>
                                        <div className={styles.statsCard}>
                                            <h6>Total Submissions</h6>
                                            <h1 className={styles.countone}>{this.props.itemcount}</h1>
                                        </div>
                                        <div className={styles.statsCard}>
                                            <h6>My Submissions</h6>
                                            <h1 className={styles.counttwo}>{this.props.userCount}</h1>
                                        </div>
                                    </div> */}
                <div className={styles.ProgramStatsCard}>
                  <div className={styles.CardHeader}>
                    <h6>Program Status</h6>
                  </div>
                  <div className={styles.CardBody}>
                    <div className={styles.ProgramSelection}>
                      <Label className={styles.mr2}>Select Program:</Label>
                      <Dropdown
                        options={this.props.Programs}

                        placeHolder="Select Program"
                        defaultSelectedKey={this.state.selectedItem}
                        onChange={this.getchartdata}>
                      </Dropdown>
                    </div>
                    <div>
                      <div className="row px-3">
                        <div className="col-6">
                          <span className="px-2">
                            <i className="fa fa-stop mr-1" style={{ color: '#f5a31a' }}></i>Minor Issues
                                                    </span>
                          <span className="px-2">
                            <i className="fa fa-stop mr-1" style={{ color: '#bceb3c' }}></i>On Schedule
                                                    </span>
                          <span className="px-2">
                            <i className="fa fa-stop mr-1" style={{ color: '#f05d23' }}></i>Need Help
                                                    </span>
                        </div>
                        <div className="col-6">
                          <span className="px-2">
                            <i className="fa fa-stop mr-1" style={{ color: '#0779e4' }}></i>Stable
                                                    </span>
                          <span className="px-2">
                            <i className="fa fa-stop mr-1" style={{ color: '#a6cb12' }}></i>Trending Up
                                                    </span>
                          <span className="px-2">
                            <i className="fa fa-stop mr-1" style={{ color: '#d32626' }}></i>Trending down
                                                    </span>
                        </div>
                      </div>
                      {this.state.analysis.Data.map(value => (
                        <div className="row px-3">
                          <div className="col-6 pt-2">
                            <h6>{value.Text} Status:</h6>
                            <div>
                              <ChartControl
                                type={ChartType.Doughnut}
                                datapromise={this._loadAsyncData(value.Status, 1)}
                                ref={this.chartref} options={options} />
                            </div>
                          </div>
                          <div className="col-6 pt-2">
                            <h6>{value.Text} Trend :</h6>
                            <div>
                              <ChartControl
                                type={ChartType.Doughnut}
                                datapromise={this._loadAsyncData(value.Trend, 2)}
                                ref={this.chartref} options={options} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div className="col-5 mt-2">
              <div className="card card-body" style={{ border: 'none', height: '100%' }}>
                {/* <div>
                                        <strong className={styles.counttwo}>Need Attention</strong><hr />
                                        {this.state.needAttention.map((x: any) => {
                                            console.log('working');
                                            return (<div className="row">
                                                <div className="col-1">
                                                    <img src={require("../images/alert.png")} style={{ width: '20px' }} />
                                                </div>
                                                <div className="col-10">
                                                    <h6>{x.Programs}</h6>
                                                    <p>Initiative : {x.Initiative} {x.OveralTrend}</p>
                                                    <a className="text-info" onClick={() => { this.loadAttention(event, x); }} >More ..</a>
                                                    <Dialog
                                                        hidden={this.state.hideDialog}
                                                        dialogContentProps={dialogContentProps}
                                                        modalProps={modelProps}
                                                    >
                                                        <div>
                                                            <h6>Program : {this.state.attentionOne.Programs}</h6>
                                                            <p>Initiative : {this.state.attentionOne.Initiative} {x.OveralTrend}</p>
                                                            <p>Support/Help : <span className="text-danger">{this.state.attentionOne.supportattentionneeded}</span></p>
                                                        </div>
                                                        <DialogFooter>
                                                            <DefaultButton onClick={() => { this.setState({ hideDialog: true }); }} text="Close" />
                                                        </DialogFooter>
                                                    </Dialog>
                                                </div>
                                            </div>)
                                        })}


                                    </div> */}

                <div>
                  <strong className={styles.counttwo}>Trend Analysis</strong><hr />
                  <select className="form-control" onChange={this._trendAnalysis}>
                    <option disabled>--select --</option>
                    {this.state.analysis.Initiative.map((x: any) => {
                      return <option value={x.Initiative}>{x.Initiative}</option>
                    })}
                  </select>
                  <div className="row mt-2">
                    {/* <div className="col-3 mt-5 pt-3 text-right">
                                                <div style={{ fontSize: '12px', color: 'gray' }}>Trend Up</div>
                                                <div className="mt-4" style={{ fontSize: '12px', color: 'gray' }}>Stable</div>
                                                <div className="mt-4" style={{ fontSize: '12px', color: 'gray' }}>Trend Down</div>
                                            </div> */}
                    <div className="col-12">
                      <ChartControl
                        type='line'
                        data={data2}
                        options={options2}
                      />
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
