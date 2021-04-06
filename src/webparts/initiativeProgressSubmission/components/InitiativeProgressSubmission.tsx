import * as React from 'react';
import { IInitiativeProgressSubmissionProps } from '../models/IInitiativeProgressSubmissionProps';
import styles from './styles.module.scss';
import { IInitiativeProgressSubmissionState } from '../models/IInitiativeProgressSubmissionState';
import { Label, ILabelStyles } from 'office-ui-fabric-react/lib/Label';
import { IStyleSet } from 'office-ui-fabric-react/lib/Styling';

import { Reports } from '../components/Reports';
import { NeedAttention } from '../components/NeedAttention';
import { SubmitProgress } from '../components/SubmitProgress';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Crudoperations } from '../services/SPServices';
import { Counts } from '../models/Counts';
import { ISubmission, ISubmission2 } from '../models/ISubmission';

import { IInitiativeProgressSubmissionWebPartProps } from '../InitiativeProgressSubmissionWebPart';
import LoadingOverlay from 'react-loading-overlay';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import RichTextEditor from 'react-rte';
import { UserProfile } from '../models/User';
import Parser from 'html-react-parser';
import domToPdf from 'dom-to-pdf';

import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getMaxHeight } from 'office-ui-fabric-react/lib/utilities/positioning';



// require('../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css');

const graphone: string = require('../images/graphone.png');
const grapthree: string = require('../images/grapthree.png');
const graptwo: string = require('../images/graptwo.png');

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: { marginTop: 10 },
};
export default class InitiativeProgressSubmission extends React.Component<IInitiativeProgressSubmissionProps, IInitiativeProgressSubmissionState, {}> {
  public _spops: Crudoperations;


  constructor(props: IInitiativeProgressSubmissionProps, properties: IInitiativeProgressSubmissionWebPartProps) {
    super(props);
    // SPComponentLoader.loadScript("https://kit.fontawesome.com/74a9a9044f.js");
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');;
    SPComponentLoader.loadCss("https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css");
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');

    SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', { globalExportsName: 'jQuery' }).then((jQuery: any): void => {
      SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js', { globalExportsName: 'jQuery' }).then((): void => {
      });
    });
    this.tabChange = this.tabChange.bind(this);
    this._spops = new Crudoperations(this.props);
    this.state = {
      userDetails: new UserProfile(),
      srtName:'',
      tab: 1,
      filterTab: 1,
      Programs: [],
      Initiative: [],
      loading: true,
      alert: false,
      message: 'Loading programs..',
      alertmessage: 'Report submistted successfully',
      items: [],
      ProgressReports: [],
      project: new ISubmission(),
      project2: new ISubmission2(),
      type: "",
      status: "",
      showform: false,
      userCount: 0,
      allCount: 0,
      elementId: '',
      userId: null,
      autherId: null,
      dashboardCounts: new Counts()
    };
  }
  preValues() {
    document.getElementById('list_1').style.backgroundColor = "#0460a90a"; document.getElementById('list_1').style.color = "#0460a9"; document.getElementById('list_1').style.borderLeft = "4px solid #0460a9";;
    this._spops.getCurrentProfile(this.props.context).then(res => {
      console.log('id', res);
      var surname = '';
      res.UserProfileProperties.forEach(element => {
        if(element.Key == "FirstName") surname = element.Value.slice(0,1);
        if(element.Key == "LastName") surname += element.Value.slice(0,1);
      });
      console.log('id1111111', surname);
      this.setState({type: this.props.type,userDetails: res, srtName: surname});
    //  var auth = window.open(res.PictureUrl, "_blank");
    //  setTimeout(() => {auth.close();}, 3000);
      // setTimeout(() => {this.setState({ userDetails: res});}, 3000);
      // /_layouts/15/userphoto.aspx?size=M&accountname=dennis@tenant.onmicrosoft.com
      // window.close();
      // document.getElementById('getImage').click();
      // console.log('image clicked');
      // this._spops.imageVal(this.props.context, res.PictureUrl);
    });
  }
  getProfile(){
console.log('get profile');
  }
  public async componentDidMount() {
    // this.setState({ loading: false })
    this.preValues();
    this._spops.getdefaultinitiative(this.props.context)
      .then((result: any) => {
        console.log('init,country,ngsc-country: ', result);
        if (this.props.type == '1' || this.props.type == '0') {
          this.setState({ Initiative: result.filter(x => x.DisplayInReport == true) })
        } else {
          this.setState({ Initiative: result });
        }
        if (this.props.type != '2') {
          this._spops.getprograms(this.props.context)
            .then((result: any) => {
              console.log('programs: ', result);
              const value = result.sort((a, b) => a.Title.localeCompare(b.Title));
              this.setState({ Programs: value, message: 'Loading progress reports..' });
            });
        }
        setTimeout(() => {
          this.onInIt();
        }, 1000);
      });
  }
  public onInIt() {
    this.setState({ loading: true });
    console.log('type', this.props.type);
    if (this.props.type == '2' || this.props.type == '3') {
      this._spops.topRegionalReportsGenerate(this.props.context, this.state.Initiative, this.state.Programs).then((res1: any) => {
      setTimeout(() => {
        var res:any;
        if(this.props.type == '3'){
         res = res1.sort((a, b) => a.Country_x002f_ClusterId.localeCompare(b.Country_x002f_ClusterId));
        }else{
          res = res1.sort((a, b) => a.CountryId.localeCompare(b.CountryId));
        }
        console.log('regioanl/country progress report length', res);
        this._spops.getCurrentUser(this.props.webcontext, this.props.context).then((result: any) => {
          // this.setState({ items: res, ProgressReports: res });
          const allcount = res.length;
          const type = this.props.type == '2' ? 'Country' : 'Regional';
          const usercount = res.filter(x => x.AuthorId == result.Id);
          this.setState({
            items: res,
            ProgressReports: res,
            allCount: allcount,
            userCount: usercount.length,
            userId: result,
            type: type
          })
          this._dashboardCounts(res);
        });

      }, 3000);
      });
    } else {
      this._spops.topReportsGenerate(this.props.context, this.state.Initiative, this.state.Programs).then((res1: any) => {
        console.log('progress reports length', res1);
   setTimeout(() => {
    const res = res1.sort((a, b) => a.InitiativeId.localeCompare(b.InitiativeId));
    this._spops.getCurrentUser(this.props.webcontext, this.props.context).then((result: any) => {
      // this.setState({ items: res, ProgressReports: res });
      const allcount = res.length;
      const usercount = res.filter(x => x.AuthorId == result.Id);
      setTimeout(() => {
        this.setState({
          items: res,
          ProgressReports: res,
          allCount: allcount,
          userCount: usercount.length,
          userId: result
        })
        this._dashboardCounts(res);
      }, 200);
    });
   }, 3000);
      });
    }
  }
  public _dashboardCounts(itemResult) {
    this.setState({ message: 'Loading Dashboard..' });
    this.setState({ loading: false });
    const dashboard = new Counts();
    const itemss = itemResult;
    const userItemss = itemResult.filter(x => x.AuthorId == this.state.userId.Id);
    dashboard.All.OnSchedule = itemss.filter(x => x.Overall_x0020_Status == 'On schedule; goals within reach' || x.Overall_x0020_Status == "On schedule").length;
    dashboard.All.MinurIssues = itemss.filter(x => x.Overall_x0020_Status == 'Minor issues threatening schedule and / or goals').length;
    dashboard.All.NeedHelp = itemss.filter(x => x.Overall_x0020_Status == 'Behind schedule and/or goals are risk').length;
    dashboard.All.TrendingUp = itemss.filter(x => x.Overall_x0020_Trend == 'Trending up').length;
    dashboard.All.Stable = itemss.filter(x => x.Overall_x0020_Trend == 'Stable').length;
    dashboard.All.TrendingDown = itemss.filter(x => x.Overall_x0020_Trend == 'Trending down').length;

    dashboard.User.OnSchedule = userItemss.filter(x => x.Overall_x0020_Status == 'On schedule; goals within reach' || x.Overall_x0020_Status == "On schedule").length;
    dashboard.User.MinurIssues = userItemss.filter(x => x.Overall_x0020_Status == 'Minor issues threatening schedule and / or goals').length;
    dashboard.User.NeedHelp = userItemss.filter(x => x.Overall_x0020_Status == 'Behind schedule and/or goals are risk').length;
    dashboard.User.TrendingUp = userItemss.filter(x => x.Overall_x0020_Trend == 'Trending up').length;
    dashboard.User.Stable = userItemss.filter(x => x.Overall_x0020_Trend == 'Stable').length;
    dashboard.User.TrendingDown = userItemss.filter(x => x.Overall_x0020_Trend == 'Trending down').length;
    setTimeout(() => {
      console.log('dashboard', dashboard);
      this.setState({
        dashboardCounts: dashboard
      })
    }, 200);
  }
  public _initiativeTopFilter(value, id) {
    this.setState({ elementId: id, filterTab: id });
    console.log('top card filter', value, this.state.userId.Id, id);
    let itemss = this.state.ProgressReports;
    let userItemss = this.state.ProgressReports.filter(x => x.AuthorId == this.state.userId.Id);
    if (value == 'All') {
      this.setState({
        items: itemss
      })
    } else {
      this.setState({
        items: userItemss
      })
    }
  }
  public _initiativeScopeFilter(value, key, id) {
    this.setState({ elementId: id });
    let itemss = this.state.ProgressReports;
    let userItemss = this.state.ProgressReports.filter(x => x.AuthorId == this.state.userId.Id);
    if (value == 'All') {
      this.setState({
        items: itemss.filter(x => x.Overall_x0020_Status == key)
      })
    } else {
      this.setState({
        items: userItemss.filter(x => x.Overall_x0020_Status == key)
      })
    }
  }
  public _initiativeTrendFilter(value, key, id) {
    this.setState({ elementId: id });
    console.log('_initiativeTrendFilter', value, key);
    const itemss = this.state.ProgressReports;
    const userItemss = this.state.ProgressReports.filter(x => x.AuthorId == this.state.userId.Id);
    if (value == 'All') {
      this.setState({
        items: itemss.filter(x => x.Overall_x0020_Trend == key)
      })
    } else {
      this.setState({
        items: userItemss.filter(x => x.Overall_x0020_Trend == key)
      })
    }

    // setTimeout(() => {
    //   this._spops.getGrouping(this.state.groupLabels, this.state.items, 0)
    //     .then((result: IGroup[],) => {
    //       this.setState({ groups: result, loading: false });
    //     });
    // }, 2000);
  }
  tabChange(id) {
    console.log('working', id);
    this.setState({ tab: id });
    if (id == 1) { this.onInIt() }
    for (let i = 1; i <= 4; i++) {
      if (i == id) { document.getElementById('list_' + i).style.backgroundColor = "#0460a90a"; document.getElementById('list_' + i).style.color = "#0460a9"; document.getElementById('list_' + i).style.borderLeft = "4px solid #0460a9"; }
      else { document.getElementById('list_' + i).style.backgroundColor = "#fff"; document.getElementById('list_' + i).style.color = ""; document.getElementById('list_' + i).style.borderLeft = ""; }
    }
  }
  generatePdf = () => {
    // console.log('local path');
    // const element = document.getElementById('pdfGen');
    // const options = {
    //   filename: "nbs-progress-report.pdf",
    // };
    // return domToPdf(element, options, () => {
    //   console.log('done');
    // });
  }
  public render(): React.ReactElement<IInitiativeProgressSubmissionProps> {
    const typeId: number = parseInt(this.props.type);
    var col1 = "Initiative"; var col2 = "Programs"; var sco = "Scope"; var sche = "Schedule"; var busi = "Business Case";
    if (typeId == 1) {
       if(this.props.packageName == "IO") col2 = "";
  else col2 = "Bundle";
  };
    if (typeId == 2) {
      col1 = "Country"; col2 = ""; sco = "Bundle 1"; sche = "Bundle 2"; busi = "Bundle 3";
      //  this.setState({ type: "Country" })
    }
    if (typeId == 3) {
      col1 = "Country/Cluster"; col2 = "NGSC"; sco = "Bundle 1"; sche = "Bundle 2"; busi = "Bundle 3";
      // this.setState({ type: "Regional" })
    }

    var type = "";
    if (typeId == 0) { type = "Strategic" }
    if (typeId == 1) { type = "Transformation" }
    if (typeId == 2) { type = "Country" }
    if (typeId == 3) { type = "Regional" }
    const toolbarConfig = { display: [] };
    return (
      <LoadingOverlay
        active={this.state.loading}
        spinner
        text={this.state.message}
      >
        <div className={styles.initiativeProgressSubmission} >

          <div className={styles.wrapper}>
            <div className={styles.sidenav}>
              <div className="sidebar-sticky" >

                <div className="row my-4 pl-2">
                  <div className="col-4 pr-0">
                    {this.state.userId != null &&<img id="getImage" src={this.props.apiUrl+"/_layouts/15/userphoto.aspx?size=M&accountname="+this.state.userId.UserPrincipalName}  style={{position:'absolute'}} className={styles.profile} />}
                    {/* https://sticsoftio.sharepoint.com/sites/poc/_layouts/15/userphoto.aspx?size=M&accountname=Vinay Kumar */}
                    {/* {this.state.userDetails.PictureUrl == null &&  <div className={styles.profile} style={{position:'absolute'}}><h3 className="text-center mb-4">{this.state.srtName}</h3></div>} */}
                    
                    {/* <img id="getImage" src="blob:https://teams.microsoft.com/7380434f-0341-4ce5-aca7-717f3c917749"  style={{position:'absolute'}} className={styles.profile} /> */}
                  </div>
                  <div className="col-8 offset-4 px-0">
                    <h5><strong>{this.state.userDetails.DisplayName}</strong> </h5>
                    <h6 className="p-0 text-secondary">{this.state.userDetails.Title} </h6>
                  </div>
                </div>

                <div className="px-3 my-4 d-none">
                  {/* <input className="form-control" placeholder="Search" style={{ borderRadius: '15px' }} /> */}
                </div>
                <ul className="nav flex-column">
                  <li id="list_1" className="nav-item" onClick={() => this.tabChange(1)}>
                    <a className={styles.navlink} >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-home mr-2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                      <span> NBS {this.props.packageName} Progress Reports</span>
                    </a>
                  </li>
                  <li id="list_2" className="nav-item" onClick={() => this.tabChange(2)}>
                    <a className={styles.navlink} >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-bar-chart-2 mr-2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                      <span>Submit Progress Report</span>
                    </a>
                  </li>
                  <li id="list_3" className="nav-item" onClick={() => this.tabChange(3)}>
                    <a className={styles.navlink} >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-bar-chart-2 mr-2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                      <span>Need Attention</span>
                    </a>
                  </li>
                  <li id="list_4" className="nav-item" onClick={() => this.tabChange(4)}>
                    <a className={styles.navlink}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-layers mr-2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                      <span>Dashboard</span>
                    </a>
                  </li>
                </ul>
              </div>

            </div>

            <div className={styles.maincontainer} >
              <div className={styles.contianer}>
                <NotificationContainer />
                {this.state.tab == 1 &&
                  <div>
                    <div className={styles.ReportsSection}>
                      <div className={styles.StatsContainer}>
                        <div className={this.state.elementId == '1' ? styles.statsCard + ' ' + styles.active : styles.statsCard} onClick={() => this._initiativeTopFilter('All', '1')}>
                          <div className={styles.statscontent}>
                            <h6>Total Submissions</h6>
                            <h1 className={styles.countone}>{this.state.allCount}</h1></div>
                          <div className={styles.statsgraph} >
                            <div style={{ width: '11rem' }}>
                              <CircularProgressbar value={100} text="100%" styles={buildStyles({
                                pathColor: `rgba(9, 149, 124, ${100})`,
                                textColor: '#09957c',
                                trailColor: '#09957c',
                                backgroundColor: '#09957c'
                              })} />
                            </div>
                          </div>
                        </div>

                        <div className={this.state.elementId == '2' ? styles.statsCard + ' ' + styles.active : styles.statsCard} onClick={() => this._initiativeTopFilter('', '2')}>
                          <div className={styles.statscontent}>
                            <h6>My Submissions</h6>
                            <h1 className={styles.counttwo}>{this.state.userCount}</h1></div>
                          <div className={styles.statsgraph} >

                            <div style={{ width: '11rem' }}>
                              <CircularProgressbar value={Math.round((this.state.userCount / this.state.allCount) * 100)} text={`${Math.round((this.state.userCount / this.state.allCount) * 100)}%`} />
                            </div>
                          </div>
                        </div>

                        {/* <div className={this.state.elementId == '2' ? styles.statsCard + ' ' + styles.active : styles.statsCard} onClick={() => this._initiativeTopFilter('', '2')}>
                          <div className={styles.statscontent}>
                            <h6>Need Attention</h6>
                            <h1 className={styles.countthree}>3</h1>
                          </div>

                          <div className={styles.statsgraph} >

                            <img src={graphone} alt="" />
                          </div>

                        </div> */}

                      </div>
                    </div>
                    {this.state.filterTab == 1 &&
                      <div className="row px-4">
                        <div className="col-2 p-0">
                          <div className={this.state.elementId == '3' ? 'card card-body ' + styles.active : 'card card-body'} style={{ margin: '3px', color: '#a6cb12',border: '1px solid lightgray' }} id="ini_3" onClick={() => { this._initiativeScopeFilter('All', 'On schedule; goals within reach', '3') }}>
                            <p>On Schedule</p>
                            <h3 className="d-flex justify-content-between">
                              <span>{this.state.dashboardCounts.All.OnSchedule}</span>
                              <span><i style={{ fontSize: '30px' }} className="fa fa-calendar " aria-hidden="true"></i></span>
                            </h3>
                          </div>
                        </div>
                        <div className="col-2 p-0">
                          <div className={this.state.elementId == '4' ? 'card card-body ' + styles.active : 'card card-body'} style={{ margin: '3px', color: 'darkorange',border: '1px solid lightgray' }} id="ini_4" onClick={() => { this._initiativeScopeFilter('All', 'Minor issues threatening schedule and / or goals', '4') }}>
                            <p>Minor Issues</p>
                            <h3 className="d-flex justify-content-between">
                              <span>{this.state.dashboardCounts.All.MinurIssues}</span>
                              <span><i style={{ fontSize: '30px' }} className="fa fa-exclamation-triangle" aria-hidden="true"></i></span>
                            </h3>
                          </div>
                        </div>
                        <div className="col-2 p-0">
                          <div className={this.state.elementId == '5' ? 'card card-body ' + styles.active : 'card card-body'} style={{ margin: '3px', color: '#d32626',border: '1px solid lightgray' }} id="ini_5" onClick={() => { this._initiativeScopeFilter('All', 'Behind schedule and/or goals are risk', '5') }}>
                            <p>Need Help</p>
                            <h3 className="d-flex justify-content-between">
                              <span>{this.state.dashboardCounts.All.NeedHelp}</span>
                              <span><i style={{ fontSize: '30px' }} className="fa fa-thumbs-up" aria-hidden="true"></i></span>
                            </h3>
                          </div>
                        </div>
                        <div className="col-2 p-0">
                          <div className={this.state.elementId == '6' ? 'card card-body ' + styles.active : 'card card-body'} style={{ margin: '3px', color: '#bceb3c',border: '1px solid lightgray' }} id="ini_6" onClick={() => { this._initiativeTrendFilter('All', 'Trending up', '6') }}>
                            <p>Trending Up</p>
                            <h3 className="d-flex justify-content-between">
                              <span>{this.state.dashboardCounts.All.TrendingUp}</span>
                              <span><i style={{ fontSize: '30px' }} className="fa fa-arrow-circle-up" aria-hidden="true"></i></span>
                            </h3>
                          </div>
                        </div>
                        <div className="col-2 p-0">
                          <div className={this.state.elementId == '7' ? 'card card-body ' + styles.active : 'card card-body'} id="ini_7" style={{ color: '#f5a31a', margin: '3px',border: '1px solid lightgray' }} onClick={() => { this._initiativeTrendFilter('All', 'Stable', '7') }}>
                            <p>Stable</p>
                            <h3 className="d-flex justify-content-between">
                              <span>{this.state.dashboardCounts.All.Stable}</span>
                              <span><i style={{ fontSize: '30px' }} className="fa fa-arrow-circle-right" aria-hidden="true"></i></span>
                            </h3>
                          </div>
                        </div>
                        <div className="col-2 p-0">
                          <div className={this.state.elementId == '8' ? 'card card-body ' + styles.active : 'card card-body'} id="ini_8" style={{ color: '#f05d23', margin: '3px',border: '1px solid lightgray' }} onClick={() => { this._initiativeTrendFilter('All', 'Trending down', '8') }}>
                            <p>Trending Down</p>
                            <h3 className="d-flex justify-content-between">
                              <span>{this.state.dashboardCounts.All.TrendingDown}</span>
                              <span><i style={{ fontSize: '30px' }} className="fa fa-arrow-circle-down" aria-hidden="true"></i></span>
                            </h3>
                          </div>
                        </div>

                      </div>

                    }
                    {this.state.filterTab == 2 &&
                      <div className="row px-4">
                        <div className="col-2 p-0">
                          <div className={this.state.elementId == '9' ? 'card card-body border-0' + styles.active : 'card card-body'} style={{ margin: '3px', color: '#a6cb12',border: '1px solid lightgray' }} id="ini_9" onClick={() => { this._initiativeScopeFilter('', 'On schedule; goals within reach', '9') }}>
                            <p>On Schedule</p>
                            <h3 className="d-flex justify-content-between">
                              <span>{this.state.dashboardCounts.User.OnSchedule}</span>
                              <span><i style={{ fontSize: '30px' }} className="fa fa-calendar " aria-hidden="true"></i></span>
                            </h3>
                          </div>
                        </div>
                        <div className="col-2 p-0">
                          <div className={this.state.elementId == '10' ? 'card card-body border-0' + styles.active : 'card card-body'} style={{ margin: '3px', color: 'darkorange',border: '1px solid lightgray' }} id="ini_10" onClick={() => { this._initiativeScopeFilter('', 'Minor issues threatening schedule and / or goals', '10') }}>
                            <p>Minor Issues</p>
                            <h3 className="d-flex justify-content-between">
                              <span>{this.state.dashboardCounts.User.MinurIssues}</span>
                              <span><i style={{ fontSize: '30px' }} className="fa fa-exclamation-triangle" aria-hidden="true"></i></span>
                            </h3>
                          </div>
                        </div>
                        <div className="col-2 p-0">
                          <div className={this.state.elementId == '11' ? 'card card-body border-0' + styles.active : 'card card-body'} style={{ margin: '3px', color: '#d32626',border: '1px solid lightgray' }} id="ini_11" onClick={() => { this._initiativeScopeFilter('', 'Behind schedule and/or goals are risk', '11') }}>
                            <p>Need Help</p>
                            <h3 className="d-flex justify-content-between">
                              <span>{this.state.dashboardCounts.User.NeedHelp}</span>
                              <span><i style={{ fontSize: '30px' }} className="fa fa-thumbs-up" aria-hidden="true"></i></span>
                            </h3>
                          </div>
                        </div>



                        <div className="col-2 p-0">
                          <div className={this.state.elementId == '12' ? 'card card-body border-0 ' + styles.active : 'card card-body'} id="ini_12" style={{ color: '#bceb3c', margin: '3px',border: '1px solid lightgray' }} onClick={() => { this._initiativeTrendFilter('', 'Trending up', '12') }}>
                            <p>Trending Up</p>
                            <h3 className="d-flex justify-content-between">
                              <span>{this.state.dashboardCounts.User.TrendingUp}</span>
                              <span><i style={{ fontSize: '30px' }} className="fa fa-arrow-circle-up" aria-hidden="true"></i></span>
                            </h3>
                          </div>
                        </div>
                        <div className="col-2 p-0">
                          <div className={this.state.elementId == '13' ? 'card card-body border-0' + styles.active : 'card card-body'} id="ini_13" style={{ color: '#f5a31a', margin: '3px',border: '1px solid lightgray' }} onClick={() => { this._initiativeTrendFilter('', 'Stable', '13') }}>
                            <p>Stable</p>
                            <h3 className="d-flex justify-content-between">
                              <span>{this.state.dashboardCounts.User.Stable}</span>
                              <span><i style={{ fontSize: '30px' }} className="fa fa-arrow-circle-right" aria-hidden="true"></i></span>
                            </h3>
                          </div>
                        </div>
                        <div className="col-2 p-0">
                          <div className={this.state.elementId == '14' ? 'card card-body border-0' + styles.active : 'card card-body'} id="ini_14" style={{ color: '#f05d23', margin: '3px',border: '1px solid lightgray' }} onClick={() => { this._initiativeTrendFilter('', 'Trending down', '14') }}>
                            <p>Trending Down</p>
                            <h3 className="d-flex justify-content-between">
                              <span>{this.state.dashboardCounts.User.TrendingDown}</span>
                              <span><i style={{ fontSize: '30px' }} className="fa fa-arrow-circle-down" aria-hidden="true"></i></span>
                            </h3>
                          </div>
                        </div>
                      </div>

                    }
                    <div className="card card-body p-1 border-0 shadow-sm mt-2" style={{height: 'calc(100vh - 320px)'}}>
                      <table className="table table-light table-responsive mb-0">
                        <thead>
                          <tr className="d-flex">
                            <th style={{ width: '13rem' }}>{col1}</th>
                            
                            {(typeId != 2) && <th style={{ width: '15rem' }}>{col2}</th>}
                            <th style={{ width: '23rem' }}>Key achievements in period</th>
                            <th style={{ width: '23rem' }}>Key activities for next period</th>
                            <th style={{ width: '23rem' }}>Support / Attention needed</th>
                           
                            <th style={{ width: '20rem' }}>Overall Status</th>
                            <th style={{ width: '15rem' }}>Overall Trend</th>
                            {/* <th style={{ width: '20rem' }}>{sco + ' Status'}</th>
                            <th style={{ width: '20rem' }}>{sco + ' Trend'}</th>
                            <th style={{ width: '20rem' }}>{sche + ' Status'}</th>
                            <th style={{ width: '20rem' }}>{sche + ' Trend'}</th>
                            <th style={{ width: '20rem' }}>{busi + ' Status'}</th>
                            <th style={{ width: '20rem' }}>{busi + ' Trend'}</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.items.map((x: any) => {
                            return <tr className="d-flex">
                              {(typeId == 2) && <td className="h6 mt-0" style={{ width: '13rem' }}>{x.CountryId}</td>}
                              {(typeId == 3) && <td className="h6 mt-0" style={{ width: '13rem' }}>{x.Country_x002f_ClusterId}</td>}
                              {(typeId != 2 && typeId != 3) && <td className="h6 mt-0" style={{ width: '13rem' }}>{x.InitiativeId}</td>}

                              
                              {(typeId == 3) && <td className="h6 mt-0" style={{ width: '15rem' }}>{x.NGSCId}</td>}
                              {(typeId != 2 && typeId != 3) && <td className="h6 mt-0" style={{ width: '15rem' }}>{x.ProgramsId}</td>}

                              {(typeId != 2 && typeId != 3) && <td style={{ width: '23rem' }}>{Parser(x.Key_x0020_Achievements)}</td>}
                              {(typeId == 2 || typeId == 3) && <td style={{ width: '23rem' }}> {Parser(x.Key_x0020_Achievements_x0020_in_)}</td>}


                              <td style={{ width: '23rem' }}>{Parser(x.Key_x0020_Activities_x0020_for_x)}</td>
                              <td style={{ width: '23rem' }}>{Parser(x.Support_x0020__x002f__x0020_Atte)}</td>

                              <td className="h6 mt-0" style={{ width: '20rem' }}>{x.Overall_x0020_Status}</td>
                              <td className="h6 mt-0" style={{ width: '15rem' }}>{x.Overall_x0020_Trend}</td>

                              
                              {/* {(typeId == 2 || typeId == 3) && <td className="h6 mt-0" style={{ width: '20rem' }}>{x.Bundle_x0020_1_x0020_Status}</td>}
                              {(typeId == 2 || typeId == 3) && <td className="h6 mt-0" style={{ width: '20rem' }}>{x.Bundle_x0020_1_x0020_Trend}</td>}
                              {(typeId != 2 && typeId != 3) && <td className="h6 mt-0" style={{ width: '20rem' }}>{x.Scope_x0020_Status}</td>}
                              {(typeId != 2 && typeId != 3) && <td className="h6 mt-0" style={{ width: '20rem' }}>{x.Scope_x0020_Trend}</td>}
                              {(typeId == 2 || typeId == 3) && <td className="h6 mt-0" style={{ width: '20rem' }}>{x.Bundle_x0020_2_x0020_Status}</td>}
                              {(typeId == 2 || typeId == 3) && <td className="h6 mt-0" style={{ width: '20rem' }}>{x.Bundle_x0020_2_x0020_Trend}</td>}
                              {(typeId != 2 && typeId != 3) && <td className="h6 mt-0" style={{ width: '20rem' }}>{x.Schedule_x0020_Status}</td>}
                              {(typeId != 2 && typeId != 3) && <td className="h6 mt-0" style={{ width: '20rem' }}>{x.Schedule_x0020_Trend}</td>}
                              {(typeId == 2 || typeId == 3) && <td className="h6 mt-0" style={{ width: '20rem' }}>{x.Bundle_x0020_3_x0020_Status}</td>}
                              {(typeId == 2 || typeId == 3) && <td className="h6 mt-0" style={{ width: '20rem' }}>{x.Bundle_x0020_3_x0020_Trend}</td>}
                              {(typeId != 2 && typeId != 3) && <td className="h6 mt-0" style={{ width: '20rem' }}>{x.Budget_x0020_Status}</td>}

                              {(typeId != 2 && typeId != 3) && <td className="h6 mt-0" style={{ width: '20rem' }}>{x.Budget_x0020_Trend}</td>} */}
                            </tr>
                          })}
                        </tbody>
                      </table>

                    </div>
                  </div>
                }
                {this.state.tab == 2 &&
                  <SubmitProgress ClickHandler={this.tabChange} Programs={this.state.Programs} Initiative={this.state.Initiative} {...this.props} />
                }
                {this.state.tab == 3 &&
                  <NeedAttention Programs={this.state.Programs} Initiative={this.state.Initiative} Items={this.state.ProgressReports} type={this.state.type} {...this.props} />
                }
                {this.state.tab == 4 &&
                  <Reports Programs={this.state.Programs} Initiative={this.state.Initiative} type={this.state.type} Items={this.state.ProgressReports} {...this.props} />
                }
              </div>

            </div>
          </div>

        </div>
      </LoadingOverlay >
    );
  }
}
