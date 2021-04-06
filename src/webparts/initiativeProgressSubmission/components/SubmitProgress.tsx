import * as React from 'react';
import { IInitiativeProgressSubmissionProps } from '../models/IInitiativeProgressSubmissionProps';
import { Crudoperations } from '../services/SPServices';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import RichTextEditor from 'react-rte';
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import styles from './styles.module.scss';
import { IDropdownOption, Label, PrimaryButton } from 'office-ui-fabric-react';
import { ISubmission, ISubmission2 } from '../models/ISubmission';

export interface ISubmitProgress {
  type: string;
  loading: boolean;
  achievement: any;
  activity: any;
  support: any;
  project: ISubmission;
  project2: ISubmission2;
  Initiatives: IDropdownOption[];
}
export class SubmitProgress extends React.Component<IInitiativeProgressSubmissionProps, ISubmitProgress, {}> {
  public _spops: Crudoperations;
  constructor(props: IInitiativeProgressSubmissionProps) {
    super(props);
    this._spops = new Crudoperations(this.props);
    this.state = {
      type: this.props.type,
      loading: true,
      achievement: RichTextEditor.createEmptyValue(),
      activity: RichTextEditor.createEmptyValue(),
      support: RichTextEditor.createEmptyValue(),
      project: new ISubmission(),
      project2: new ISubmission2(),
      Initiatives: []
    }
  }
  componentDidMount() {
    if (this.props.type == '1' || this.props.type == '2') {
      this.setState({
        Initiatives: this.props.Initiative
      })
    }
    if(this.props.type == '0'){
      let x = this.state.project;
     const id = this.props.Programs[0].Id;
     x.ProgramsId = id;
      this.setState({
        project: x,
        Initiatives: this.props.Initiative.filter(z => z.BundleId == id)
      });
    }
    if(this.props.type == '3'){
      let x = this.state.project2;
     const id = this.props.Programs[0].Id;
     x.NGSCId = id;
      this.setState({
        project2: x,
        Initiatives: this.props.Initiative.filter(z => z.NGSCId == id)
      });
    }
  }
  public _handlebtnchange(e) {
    console.log(e.target.value, e.target.name)
    let x;
    let name = e.target.name;
    if (this.props.type == '2' || this.props.type == '3') {
      x = this.state.project2;
      x.Key_x0020_Achievements_x0020_in_ = this.state.achievement.toString('html');
      x.Key_x0020_Activities_x0020_for_x = this.state.activity.toString('html');
      x.Support_x0020__x002f__x0020_Atte = this.state.support.toString('html');
      if (name == "scopeStatus") { x.Bundle_x0020_1_x0020_Status = e.target.value; }
      else if (name == "scheduleStatus") { x.Bundle_x0020_2_x0020_Status = e.target.value; }
      else if (name == "businessCaseStatus") { x.Bundle_x0020_3_x0020_Status = e.target.value; }
      else if (name == "cncStatus") { x.Bundle_x0020_4_x0020_Status = e.target.value; }
      else if (name == "imOpStatus") { x.Bundle_x0020_5_x0020_Status = e.target.value; }
      else if (name == "7Status") { x.Bundle_x0020_7_x0020_Status = e.target.value; }
      else if (name == "8Status") { x.Bundle_x0020_8_x0020_Status = e.target.value; }
      else if (name == "9Status") { x.Change_x0020_and_x0020_Comms_x00 = e.target.value; }
      else if (name == "overallStatus") { x.Overall_x0020_Status = e.target.value; }

      else if (name == "scopeTrend") { x.Bundle_x0020_1_x0020_Trend = e.target.value; }
      else if (name == "scheduleTrend") { x.Bundle_x0020_2_x0020_Trend = e.target.value; }
      else if (name == "busineeCaseTrend") { x.Bundle_x0020_3_x0020_Trend = e.target.value; }
      else if (name == "cncTrend") { x.Bundle_x0020_4_x0020_Trend = e.target.value; }
      else if (name == "imOpTrend") { x.Bundle_x0020_5_x0020_Trend = e.target.value; }
      else if (name == "7Trend") { x.Bundle_x0020_7_x0020_Trend = e.target.value; }
      else if (name == "8Trend") { x.Bundle_x0020_8_x0020_Trend = e.target.value; }
      else if (name == "9Trend") { x.Change_x0020_and_x0020_Comms_x000 = e.target.value; }
      else if (name == "overalTrend") { x.Overall_x0020_Trend = e.target.value; }
      this.setState({ project2: x });
    }
    else {
      x = this.state.project;
      x.Key_x0020_Achievements = this.state.achievement.toString('html');
      x.Key_x0020_Activities_x0020_for_x = this.state.activity.toString('html');
      x.Support_x0020__x002f__x0020_Atte = this.state.support.toString('html');
      if (name == "scopeStatus") { x.Scope_x0020_Status = e.target.value; }
      else if (name == "scheduleStatus") { x.Schedule_x0020_Status = e.target.value; }
      else if (name == "businessCaseStatus") { x.Budget_x0020_Status = e.target.value; }
      else if (name == "overallStatus") { x.Overall_x0020_Status = e.target.value; }
      else if (name == "scopeTrend") { x.Scope_x0020_Trend = e.target.value; }
      else if (name == "scheduleTrend") { x.Schedule_x0020_Trend = e.target.value; }
      else if (name == "busineeCaseTrend") { x.Budget_x0020_Trend = e.target.value; }
      else if (name == "overalTrend") { x.Overall_x0020_Trend = e.target.value; }
      else if (name == "cncStatus") { x.Change_x0020__x0026__x0020_Comms = e.target.value; }
      else if (name == "cncTrend") { x.Change_x0020__x0026__x0020_Comms0 = e.target.value; }
      else if (name == "imOpStatus") { x.Impact_x0020_On_x0020_Operations = e.target.value; }
      else if (name == "imOpTrend") { x.Impact_x0020_On_x0020_Operations0 = e.target.value; }
      this.setState({ project: x });
    }
  }
  onChange1 = (value) => {
    var appendVal =value;
    if(this.state.achievement == undefined)  appendVal = this.state.achievement +" "+ value;
    this.setState({ achievement: appendVal });
    console.log('value html', value.toString('html'));
  };
  onChange2 = (value) => {
    var appendVal =value;
    if(this.state.achievement == undefined)   appendVal = this.state.activity +" "+ value;
    this.setState({ activity: appendVal });
    console.log('value html', value.toString('html'));
  };
  onChange3 = (value) => {
    var appendVal =value;
    if(this.state.achievement == undefined)   appendVal = this.state.support +" "+ value;
    this.setState({ support: appendVal });
    console.log('value html', value.toString('html'));
  };
  public getinitiativeval(event) {
    console.log(event.target.value);
    let x;
    if (this.props.type == '3') {
      x = this.state.project2
      x.Country_x002f_ClusterId = event.target.value;
    }
    else if (this.props.type == '2') {
      x = this.state.project2
      x.CountryId = event.target.value;
    }
    else {
      x = this.state.project;
      x.InitiativeId = event.target.value;
    };
    this.setState({ project: x, project2: x });
  }

  public getprogramval(event) {
    console.log('program id', event.target.value);
    let x;
    if (this.props.type == '3') {
      x = this.state.project2;
      x.NGSCId = event.target.value;
      this.setState({
        project2: x,
        Initiatives: this.props.Initiative.filter(z => z.NGSCId == event.target.value)
      });
    }
    else {
      x = this.state.project;
      x.ProgramsId = event.target.value;
      this.setState({
        project: x,
        Initiatives: this.props.Initiative.filter(z => z.BundleId == event.target.value)
      });
    }
  }
  createNotification = (type) => {
    return () => {
      switch (type) {
        case 'info':
          NotificationManager.info('Info message');
          break;
        case 'success':
          NotificationManager.success('Report submitted successfully..', 'Success');
          break;
        case 'warning':
          NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
          break;
        case 'error':
          NotificationManager.error('Something went wrong!', 'Error', 5000);
          break;
      }
    };
  }
  clear = (id) => {
    console.log(id);
    console.log(this.props);
    this.props.ClickHandler(id);
  }
  render() {
    const typeId: number = parseInt(this.props.type);
    var type = "";
    if (typeId == 0) { type = "Strategic" }
    if (typeId == 1) { type = "Transformation" }
    if (typeId == 2) { type = "Country" }
    if (typeId == 3) { type = "Regional" }
    const toolbarConfig = { display: [] }
    // const toolbarConfig1 = {
    //     // Optionally specify the groups to display (displayed in the order listed).
    //     display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
    //     INLINE_STYLE_BUTTONS: [
    //         { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
    //         { label: 'Italic', style: 'ITALIC' },
    //         { label: 'Underline', style: 'UNDERLINE' }
    //     ],
    //     BLOCK_TYPE_DROPDOWN: [
    //         { label: 'Normal', style: 'unstyled' },
    //         { label: 'Heading Large', style: 'header-one' },
    //         { label: 'Heading Medium', style: 'header-two' },
    //         { label: 'Heading Small', style: 'header-three' }
    //     ],
    //     BLOCK_TYPE_BUTTONS: [
    //         { label: 'UL', style: 'unordered-list-item' },
    //         { label: 'OL', style: 'ordered-list-item' }
    //     ]
    // };
    return (
      <div>

        {/* new layout start */}
        <div className="row mt-2">
          <div className="col-12">

            <div className="card card-body border-0 shadow-sm">
              <div className={styles.newsubheader}>
                <span className="h4">New Submission</span>
                <div className="float-right">

                
                  <button type="button" hidden id="success_btn" onClick={this.createNotification('success')} className="btn btn-default" data-dismiss="modal">success</button>
                  <button type="button" hidden id="error_btn" onClick={this.createNotification('error')} className="btn btn-default" data-dismiss="modal">error</button>
                  <button type="submit" className="btn btn-primary "
                    onClick={() => this._spops.createItem(this.props.context, this.state.project)
                      .then((results: any) => {
                        if (results.nativeResponse.status == 400) { document.getElementById('error_btn').click(); }
                        else { document.getElementById('success_btn').click(); this.clear(1) }
                      })}> Save
                  </button>
                  <button type="button" id="close_btn" className="btn btn-default ml-2" onClick={() => this.clear(1)}>Close</button>
                </div>
              </div>
              <div className="row">
                {(typeId == 0 || typeId == 3) &&
                  <div className="col-md-6">
                    {typeId == 0 && <Label><strong>Program :</strong></Label>}
                    {typeId == 3 && <Label><strong>NGSC :</strong></Label>}
                    <select className="form-control" id="firstDropdown" onChange={() => { this.getprogramval(event) }}>
                      {this.props.Programs.map((x: any) => {
                        return <option value={x.Id}>{x.Title}</option>
                      })}
                    </select>
                  </div>
                }
                <div className="col-md-6">
                  {(typeId != 3 && typeId != 2) && <Label><strong>Initiative :</strong></Label>}
                  {(typeId == 3 || typeId == 2) && <Label><strong>Country :</strong></Label>}
                  <select className="form-control" onChange={() => { this.getinitiativeval(event) }}>
                  <option >Select</option>
                    {this.state.Initiatives.map((x: any) => {
                      return <option value={x.Id}>{x.Title}</option>
                    })}
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="row mt-3">
          <div className="col-6 pr-2">
            {/* style={{height:'50rem',maxHeight:'50rem',overflowY:'scroll',overflowX:'hidden'}} */}
            {/* style={{ height: '14rem',overflowY:'scroll' }} */}
            <div >
              <div className="card card-body border-0 shadow-sm my-3" >
                <Label style={{ padding: '0px 0px 16px 0px' }}><strong>Key Achievements In Period :</strong></Label>
                <RichTextEditor toolbarConfig={toolbarConfig} value={this.state.achievement} onChange={this.onChange1} style={{ height: '20rem', margintop: '16px' }} />
              </div>

              <div className="card card-body border-0 shadow-sm my-3" >
                <Label style={{ padding: '0px 0px 16px 0px' }}><strong>Key Activities For Next Period : </strong></Label>
                <RichTextEditor toolbarConfig={toolbarConfig} value={this.state.activity} onChange={this.onChange2} style={{ height: '20rem', margintop: '16px' }} />
              </div>

              <div className="card card-body border-0 shadow-sm my-3" >
                <Label style={{ padding: '0px 0px 16px 0px' }}><strong>Support / Attention Needed : </strong></Label>
                <RichTextEditor toolbarConfig={toolbarConfig} value={this.state.support} onChange={this.onChange3} style={{ height: '20rem', margintop: '16px' }} />
              </div>
            </div>
          </div>
          <div className="col-6 pl-2 pr-0">
            <div className={styles.selectioncontainer} >
              <div className="card card-body border-0 shadow-sm my-3">
                {/* scope container */}
                <div className="row">
                  <div className="col-6">
                    {(typeId == 0 || typeId == 1) && <Label><strong>Scope Status :</strong></Label>}
                    {(typeId == 2 || typeId == 3) && <Label><strong>Bundle 1 Status :</strong></Label>}
                    <div>
                      <label className={styles.container1}>On schedule
                                    <input type="radio" name="scopeStatus" value="On schedule; goals within reach" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
                    {(typeId == 0 || typeId == 1) && <Label><strong>Scope Trend :</strong></Label>}
                    {(typeId == 2 || typeId == 3) && <Label><strong>Bundle 1 Trend :</strong></Label>}
                    <label className={styles.container4}>Trending up
                                    <input type="radio" name="scopeTrend" value="Trending up" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <label className={styles.container2}>Minor issues threatening schedule and / or goals
                      <input type="radio" name="scopeStatus" value="Minor issues threatening schedule and / or goals" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                  <div className="col-6">
                    <label className={styles.container5}>Stable
                                     <input type="radio" name="scopeTrend" value="Stable" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <label className={styles.container3}>Behind schedule and / or goals are risk
                                    <input type="radio" name="scopeStatus" value="Behind schedule and/or goals are risk" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                  <div className="col-6">
                    <label className={styles.container3}>Trending down
                                    <input type="radio" name="scopeTrend" value="Trending down" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                </div>
              </div>
              {/* schedule container */}
              <div className="card card-body border-0 shadow-sm my-3">
                <div className="row">
                  <div className="col-6">
                    {(typeId == 0 || typeId == 1) && <Label><strong>Schedule Status :</strong></Label>}
                    {(typeId == 2 || typeId == 3) && <Label><strong>Bundle 2 Status :</strong></Label>}
                    <div>
                      <label className={styles.container1}>On schedule
                                    <input type="radio" name="scheduleStatus" value="On schedule; goals within reach" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
                    {(typeId == 0 || typeId == 1) && <Label><strong>Schedule Trend :</strong></Label>}
                    {(typeId == 2 || typeId == 3) && <Label><strong>Bundle 2 Trend :</strong></Label>}
                    <div>
                      <label className={styles.container4}>Trending up
                                    <input type="radio" name="scheduleTrend" value="Trending up" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <label className={styles.container2}>Minor issues threatening schedule and / or goals
                                     <input type="radio" name="scheduleStatus" value="Minor issues threatening schedule and / or goals" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                  <div className="col-6">
                    <label className={styles.container5}>Stable
                                     <input type="radio" name="scheduleTrend" value="Stable" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                </div>
                <div className="row">
                    <div className="col-6">
                      <label className={styles.container3}>Behind schedule and / or goals are risk
                                    <input type="radio" name="scheduleStatus" value="Behind schedule and/or goals are risk" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                      </label>
                    </div>
                    <div className="col-6">
                    <label className={styles.container3}>Trending down
                                    <input type="radio" name="scheduleTrend" value="Trending down" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                  </div>

              </div>
              {/* business container */}
              <div className="card card-body border-0 shadow-sm my-3">
                <div className="row">
                  <div className="col-6">
                    {(typeId == 0 || typeId == 1) && <Label><strong>Business Case Status :</strong></Label>}
                    {(typeId == 2 || typeId == 3) && <Label><strong>Bundle 3 Status :</strong></Label>}
                    <div>
                      <label className={styles.container1}>On schedule
                                    <input type="radio" name="businessCaseStatus" value="On schedule; goals within reach" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
                    {(typeId == 0 || typeId == 1) && <Label><strong>Business Case Trend :</strong></Label>}
                    {(typeId == 2 || typeId == 3) && <Label><strong>Bundle 3 Trend :</strong></Label>}
                    <div>
                      <label className={styles.container4}>Trending up
                                    <input type="radio" name="busineeCaseTrend" value="Trending up" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <label className={styles.container2}>Minor issues threatening schedule and / or goals
                                     <input type="radio" name="businessCaseStatus" value="Minor issues threatening schedule and / or goals" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                  <div className="col-6">
                    <label className={styles.container5}>Stable
                                     <input type="radio" name="busineeCaseTrend" value="Stable" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <label className={styles.container3}>Behind schedule and / or goals are risk
                                    <input type="radio" name="businessCaseStatus" value="Behind schedule and/or goals are risk" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                  <div className="col-6">
                    <label className={styles.container3}>Trending down
                                    <input type="radio" name="busineeCaseTrend" value="Trending down" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                </div>

              </div>

              {/* commission container */}
              <div className="card card-body border-0 shadow-sm my-3">
                <div className="row">
                  <div className="col-6">
                    {(typeId == 0 || typeId == 1) && <Label><strong>Communication & Comm. Status :</strong></Label>}
                    {(typeId == 2 || typeId == 3) && <Label><strong>Bundle 4 Status :</strong></Label>}
                    <div>
                      <label className={styles.container1}>On schedule
                                    <input type="radio" name="cncStatus" value="On schedule; goals within reach" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
                    {(typeId == 0 || typeId == 1) && <Label><strong>Communication & Comm. Trend :</strong></Label>}
                    {(typeId == 2 || typeId == 3) && <Label><strong>Bundle 4 Trend :</strong></Label>}
                    <div>
                      <label className={styles.container4}>Trending up
                                    <input type="radio" name="cncTrend" value="Trending up" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <label className={styles.container2}>Minor issues threatening schedule and / or goals
                                     <input type="radio" name="cncStatus" value="Minor issues threatening schedule and / or goals" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                  <div className="col-6">
                    <label className={styles.container5}>Stable
                                     <input type="radio" name="cncTrend" value="Stable" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <label className={styles.container3}>Behind schedule and / or goals are risk
                                    <input type="radio" name="cncStatus" value="Behind schedule and/or goals are risk" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                  <div className="col-6">
                    <label className={styles.container3}>Trending down
                                    <input type="radio" name="cncTrend" value="Trending down" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                </div>

              </div>
              {/* impact container */}
              <div className="card card-body border-0 shadow-sm my-3">
                <div className="row">
                  <div className="col-6">
                    {(typeId == 0 || typeId == 1) && <Label><strong>Impact on Ops Status :</strong></Label>}
                    {(typeId == 2 || typeId == 3) && <Label><strong>Bundle 5 Status :</strong></Label>}
                    <div>
                      <label className={styles.container1}>On schedule
                                    <input type="radio" name="imOpStatus" value="On schedule; goals within reach" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
                    {(typeId == 0 || typeId == 1) && <Label><strong>Impact on Ops Trend :</strong></Label>}
                    {(typeId == 2 || typeId == 3) && <Label><strong>Bundle 5 Trend :</strong></Label>}
                    <div>
                      <label className={styles.container4}>Trending up
                                    <input type="radio" name="imOpTrend" value="Trending up" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <label className={styles.container2}>Minor issues threatening schedule and / or goals
                                     <input type="radio" name="imOpStatus" value="Minor issues threatening schedule and / or goals" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                  <div className="col-6">
                    <label className={styles.container5}>Stable
                                     <input type="radio" name="imOpTrend" value="Stable" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <label className={styles.container3}>Behind schedule and / or goals are risk
                                    <input type="radio" name="imOpStatus" value="Behind schedule and/or goals are risk" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                  <div className="col-6">
                    <label className={styles.container3}>Trending down
                                    <input type="radio" name="imOpTrend" value="Trending down" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                    </label>
                  </div>
                </div>

              </div>
              {(typeId == 2 || typeId == 3) &&
                <div>
                  <div className="card card-body border-0 shadow-sm my-3">
                    <div className="row">
                      <div className="col-6">
                        <Label><strong>Bundle 7 Status :</strong></Label>
                        <div>
                          <label className={styles.container1}>On schedule
                                    <input type="radio" name="7Status" value="On schedule; goals within reach" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                          </label>
                        </div>
                      </div>
                      <div className="col-6">
                        <Label><strong>Bundle 7 Trend : </strong></Label>
                        <div>
                          <label className={styles.container4}>Trending up
                                    <input type="radio" name="7Trend" value="Trending up" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <label className={styles.container2}>Minor issues threatening schedule and / or goals
                                     <input type="radio" name="7Status" value="Minor issues threatening schedule and / or goals" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                        </label>
                      </div>
                      <div className="col-6">
                        <label className={styles.container5}>Stable
                                     <input type="radio" name="7Trend" value="Stable" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <label className={styles.container3}>Behind schedule and / or goals are risk
                                    <input type="radio" name="7Status" value="Behind schedule and/or goals are risk" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                        </label>
                      </div>
                      <div className="col-6">
                        <label className={styles.container3}>Trending down
                                    <input type="radio" name="7Trend" value="Trending down" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="card card-body border-0 shadow-sm my-3">
                    <div className="row">
                      <div className="col-6">
                        <Label><strong>Bundle 8 Status :</strong></Label>
                        <div>
                          <label className={styles.container1}>On schedule
                                    <input type="radio" name="8Status" value="On schedule; goals within reach" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                          </label>
                        </div>
                      </div>
                      <div className="col-6">
                        <Label><strong>Bundle 8 Trend : </strong></Label>
                        <div>
                          <label className={styles.container4}>Trending up
                                    <input type="radio" name="8Trend" value="Trending up" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <label className={styles.container2}>Minor issues threatening schedule and / or goals
                                     <input type="radio" name="8Status" value="Minor issues threatening schedule and / or goals" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                        </label>
                      </div>
                      <div className="col-6">
                        <label className={styles.container5}>Stable
                                     <input type="radio" name="8Trend" value="Stable" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <label className={styles.container3}>Behind schedule and / or goals are risk
                                    <input type="radio" name="8Status" value="Behind schedule and/or goals are risk" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                        </label>
                      </div>
                      <div className="col-6">
                        <label className={styles.container3}>Trending down
                                    <input type="radio" name="8Trend" value="Trending down" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="card card-body border-0 shadow-sm my-3">
                    <div className="row">
                      <div className="col-6">
                        <Label><strong>Change and Comms Status :</strong></Label>
                        <div>
                          <label className={styles.container1}>On schedule
                                    <input type="radio" name="9Status" value="On schedule; goals within reach" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                          </label>
                        </div>
                      </div>
                      <div className="col-6">
                        <Label><strong>Change and Comms Trend : </strong></Label>
                        <div>
                          <label className={styles.container4}>Trending up
                                    <input type="radio" name="9Trend" value="Trending up" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <label className={styles.container2}>Minor issues threatening schedule and / or goals
                                     <input type="radio" name="9Status" value="Minor issues threatening schedule and / or goals" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                        </label>
                      </div>
                      <div className="col-6">
                        <label className={styles.container5}>Stable
                                     <input type="radio" name="9Trend" value="Stable" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <label className={styles.container3}>Behind schedule and / or goals are risk
                                    <input type="radio" name="9Status" value="Behind schedule and/or goals are risk" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                        </label>
                      </div>
                      <div className="col-6">
                        <label className={styles.container3}>Trending down
                                    <input type="radio" name="9Trend" value="Trending down" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              }
              {/* overall container */}
              <div className="card card-body border-0 shadow-sm my-3">
              <div className="row">
                  <div className="col-6">
                    <Label><strong>Overall Status :</strong></Label>
                    <div>
                      <label className={styles.container1}>On schedule
                                    <input type="radio" name="overallStatus" value="On schedule; goals within reach" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
                    <Label><strong>Overall Trend : </strong></Label>
                    <div>
                      <label className={styles.container4}>Trending up
                                    <input type="radio" name="overalTrend" value="Trending up" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                      </label>
                    </div>
                  </div>
                </div>
               <div className="row">
                  <div className="col-6">
                      <label className={styles.container2}>Minor issues threatening schedule and / or goals
                                     <input type="radio" name="overallStatus" value="Minor issues threatening schedule and / or goals" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                      </label>
                  </div>
                  <div className="col-6">
                      <label className={styles.container5}>Stable
                                     <input type="radio" name="overalTrend" value="Stable" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                      </label>
                  </div>
                </div>
               <div className="row">
                  <div className="col-6">
                      <label className={styles.container3}>Behind schedule and / or goals are risk
                                    <input type="radio" name="overallStatus" value="Behind schedule and/or goals are risk" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                      </label>
                  </div>
                  <div className="col-6">
                      <label className={styles.container3}>Trending down
                                    <input type="radio" name="overalTrend" value="Trending down" onChange={() => { this._handlebtnchange(event) }} /><span className={styles.checkmark}></span>
                      </label>
                  </div>
                </div>
               </div>
            </div>
          </div>
        </div>
        {/* new layout end */}
        {/* <button hidden onClick={(e) => { console.log('clicked'); }}>test</button> */}

      </div>
    );
  }
}
