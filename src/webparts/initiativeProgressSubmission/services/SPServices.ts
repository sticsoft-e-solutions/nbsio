import { WebPartContext, BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";
import { IDropdownOption, IObjectWithKey, IGroup } from "office-ui-fabric-react";
import { ISubmission, ISubmission2 } from "../models/ISubmission";
import { Analysis } from '../models/Analysis';
import { Provider } from "react";
import { Category, TrendAnalysis } from "../models/Category";
import * as moment from 'moment';
const { htmlToText } = require('html-to-text');

import { IInitiativeProgressSubmissionProps } from '../models/IInitiativeProgressSubmissionProps';
import HTMLReactParser from "html-react-parser";
import { UserProfile } from "../models/User";

export class Crudoperations {
    public analysis: Analysis;
    public baseUrl: string;
    public submissionList: string;
    public initCuntryList: string;
    public progBunNGSCList: string;
    public type: string;
    public init: any = [];
    constructor(public props: IInitiativeProgressSubmissionProps) {
        this.analysis = new Analysis();
        this.baseUrl = this.props.apiUrl;
        this.submissionList = this.props.submissionListName;
        this.initCuntryList = this.props.countryList;
        this.progBunNGSCList = this.props.ngscList;
        this.type = this.props.type;
        console.log('baseurl: ----', this.props);
    }
    public getdefaultinitiative(context: SPHttpClient): Promise<IDropdownOption[]> {
        console.log('testtt');
        let geturl: string = this.baseUrl + "/_api/web/lists/GetByTitle('" + this.initCuntryList + "')/items?";
        return new Promise<any>((resolve, reject) => {
            SPHttpClient
            context.get(geturl, SPHttpClient.configurations.v1).then(
                (Response: SPHttpClientResponse) => {
                    Response.json().then((results: any) => {
                        resolve(results.value);
                    });
                }, (error: any): void => {
                    alert(error.message);
                    reject("error ocuured" + error.message);
                }
            )
        })
    }
    public getprograms(context: SPHttpClient): Promise<any> {
        let geturl: string = this.baseUrl + "/_api/web/lists/GetByTitle('" + this.progBunNGSCList + "')/items?$select=Title,Id";
        return new Promise<IDropdownOption[]>(async (resolve, reject) => {
            await context
                .get(geturl, SPHttpClient.configurations.v1).then(
                    (Response: SPHttpClientResponse) => {
                        Response.json().then((results: any) => {
                            resolve(results.value);
                        });
                    }, (error: any): void => {
                        alert("List is not added properly. Please check and refresh.");
                        reject("error ocuured" + error);
                    }
                );
        });
    }
    public getlistitems(context: SPHttpClient, program: any, initiative: any): Promise<any> {
        let geturl: string = this.baseUrl + "/_api/web/lists/GetByTitle('" + this.submissionList + "')/Items?";
        geturl = geturl + "&select=*";
        geturl = geturl + "&$orderby=InitiativeId";
        return new Promise<any>(async (resolve, reject) => {
            await context
                .get(geturl, SPHttpClient.configurations.v1).then(
                    (Response: SPHttpClientResponse) => {
                        Response.json().then((results: any) => {
                            results.value.map(async (result: any, index) => {
                                let pro = program.find(x => x.Id == result.ProgramsId);
                                let init = initiative.find(x => x.Id == result.InitiativeId);
                                if (result.InitiativeId) {
                                    result.ProgramsId = pro ? pro.Title : result.ProgramsId;
                                    result.InitiativeId = init ? init.Title : result.InitiativeId;
                                }
                            });
                            resolve(results.value);
                        });
                    }, (error: any): void => {
                        alert("error in progress submission list");
                        reject("error ocuured" + error);
                    }
                );
        });
    }
    public topReportsGenerate(context: SPHttpClient, initiatives: any, program: any): Promise<any> {
        var items: ISubmission[] = [];
        console.log('programs', program);
        console.log('initiative', initiatives);
        const stopwords: string[] = [" ","n/a",'​_na', '​na', '​na↵', 'none', 'n.a.', 'none required', 'no support needed at this point in time', ''];
        return new Promise<any>((resolve, reject) => {
            if (initiatives) {
                initiatives.map(async (value: any) => {
                    let geturl: string = this.baseUrl + "/_api/web/lists/GetByTitle('" + this.submissionList + "')/items?";
                    geturl = geturl + "&select=Created,Id,Title";
                    geturl = geturl + "&$filter=Initiative eq '" + value.Id + "'";
                    geturl = geturl + "&$orderby=Created desc&$top=1";
                    await context
                        .get(geturl, SPHttpClient.configurations.v1).then(
                            (Response: SPHttpClientResponse) => {
                                Response.json().then((results: any) => {
                                    console.log('trans value', results.value);
                                    if (results.value[0]) {
                                        if (this.type == '0') {
                                            const pro = program.find(zx => zx.Id == results.value[0].ProgramsId);
                                            if (pro) {
                                                console.log('pro123', pro);
                                                results.value[0].ProgramsId = pro.Title;
                                            }
                                        }
                                        // .replace(/<[^>]+>/g, '')
                                        // .replace(/<\s*br[^>]?>/,'\n').replace(/(<([^>]+)>)/g, "")
                                        console.log('word start', results.value[0].Support_x0020__x002f__x0020_Atte);
                                        results.value[0].InitiativeId = value.Title;
                                        results.value[0].Key_x0020_Achievements = results.value[0].Key_x0020_Achievements;
                                        results.value[0].Key_x0020_Activities_x0020_for_x = results.value[0].Key_x0020_Activities_x0020_for_x;
                                        results.value[0].Support_x0020__x002f__x0020_Atte = results.value[0].Support_x0020__x002f__x0020_Atte;
                                        results.value[0].Created = results.value[0].Created.slice(0, 10);
                                        // results.value[0].Support_x0020__x002f__x0020_Atte = results.value[0].Support_x0020__x002f__x0020_Atte.replace(/<\s*br[^>]?>/, '\n').replace(/(<([^>]+)>)/g, "").replace(/&#?[a-z0-9]+;/g, " ");
                                        // var incWord = (results.value[0].Support_x0020__x002f__x0020_Atte.replace(/[^\x20-\x7E]/g, '')).toLowerCase();
                                        // var incWord = (results.value[0].Support_x0020__x002f__x0020_Atte.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '')).toLowerCase();
                                      
                                        items.push(results.value[0]);
                                        // incWord = incWord.trim();
                                        // const word = stopwords.includes(incWord);
                                        // console.log('stop words', stopwords);
                                        // console.log('word end1', incWord);
                                        // console.log('word', word);
                                        // if (!word) { items.push(results.value[0]); console.log('in item'); }
                                        // console.log('findstop11',results.value[0].Support_x0020__x002f__x0020_Atte,findstop, stopwords);
                                        // if (!findstop) 

                                    }
                                });
                            }, (error: any): void => {
                                alert("error in progress submission list");
                                reject("error ocuured" + error);
                            }
                        )
                })
                resolve(items);
            }
            else {
                return null;
            }
        })
    }
    public topRegionalReportsGenerate(context: SPHttpClient, countries: any, ngsc: any): Promise<any> {
        var items: ISubmission2[] = [];
        console.log('country/regional');
        const stopwords: any = [" ","n/a",'​_na', '​na', '​na↵', 'none', 'n.a.', 'none required', 'no support needed at this point in time', ''];
        return new Promise<any>((resolve, reject) => {
            countries.map(async (value: any) => {
                let geturl: string = this.baseUrl + "/_api/web/lists/GetByTitle('" + this.submissionList + "')/items?";
                geturl = geturl + "&select=Created,Id,Title";

                if (this.type == '2') { geturl = geturl + "&$filter=CountryId eq '" + value.Id + "'"; }
                if (this.type == '3') { geturl = geturl + "&$filter=Country_x002f_ClusterId eq '" + value.Id + "'"; }
                geturl = geturl + "&$orderby=Created desc&$top=1";
                await context
                    .get(geturl, SPHttpClient.configurations.v1).then(
                        (Response: SPHttpClientResponse) => {
                            Response.json().then((results: any) => {
                                console.log('trans value', results.value);
                                if (results.value[0]) {
                                    if (this.type == '3') {
                                        const pro = ngsc.find(zx => zx.Id == results.value[0].NGSCId);
                                        if (pro) {
                                            results.value[0].NGSCId = pro.Title;
                                            results.value[0].Country_x002f_ClusterId = value.Title;
                                        }

                                    } else {
                                        results.value[0].CountryId = value.Title;
                                    }
                                    results.value[0].Key_x0020_Achievements_x0020_in_ = results.value[0].Key_x0020_Achievements_x0020_in_;
                                    results.value[0].Key_x0020_Activities_x0020_for_x = results.value[0].Key_x0020_Activities_x0020_for_x;
                                    results.value[0].Support_x0020__x002f__x0020_Atte = results.value[0].Support_x0020__x002f__x0020_Atte;
                                    results.value[0].Created = results.value[0].Created.slice(0, 10);
                                    // results.value[0].Support_x0020__x002f__x0020_Atte = results.value[0].Support_x0020__x002f__x0020_Atte.replace(/<[^>]+>/g, '').replace(/&#?[a-z0-9]+;/g, " ").replace("&#8203;",'');
                                    // const findstop = stopwords.find(x => x == (results.value[0].Support_x0020__x002f__x0020_Atte).toLowerCase());
                                    // if (!findstop) { items.push(results.value[0]); }
                                    items.push(results.value[0]);

                                    // results.value[0].Support_x0020__x002f__x0020_Atte = results.value[0].Support_x0020__x002f__x0020_Atte.replace(/<\s*br[^>]?>/, '\n').replace(/(<([^>]+)>)/g, "").replace(/&#?[a-z0-9]+;/g, " ");
                                    // results.value[0].Created = results.value[0].Created.slice(0, 10);
                                    // var incWord = (results.value[0].Support_x0020__x002f__x0020_Atte.replace(/[^\x20-\x7E]/g, '')).toLowerCase();
                                    // incWord = incWord.trim();
                                    // const word = stopwords.includes(incWord);
                                    // console.log('word end1', incWord);
                                    // console.log('word', word);
                                    // if (!word) {  }
                                }
                            });
                        }, (error: any): void => {
                            alert("error in progress submission list");
                            reject("error ocuured" + error);
                        }
                    )
            })
            resolve(items);
        })
    }
    public async getGroupingLable1(items, id: number): Promise<string[]> {
        const _groupfield = [];
        console.log('test-', items);

        if (this.type == '2') {
            items.map((result: any) => {
                if (_groupfield.indexOf(result.CountryId) === -1) {
                    _groupfield.push(result.CountryId);
                }
            });
        }
        else if (this.type == '3') {
            items.map((result: any) => {
                if (_groupfield.indexOf(result.Country_x002f_ClusterId) === -1) {
                    _groupfield.push(result.Country_x002f_ClusterId);
                }
            });
        }
        else {
            items.map((result: any) => {
                if (_groupfield.indexOf(result.InitiativeId) === -1) {
                    _groupfield.push(result.InitiativeId);
                }
            });
        }


        return _groupfield;
    }
    public async getGrouping(groupList: string[], items: any, id: number): Promise<IGroup[]> {
        var Groups: IGroup[] = [];
        let itemcount: number;
        let prevcount = 0;
        groupList.map((x, index) => {
            if (this.type == '2') {
                itemcount = items.filter(z => z.CountryId == x).length;
            } else if (this.type == '3') {
                itemcount = items.filter(z => z.Country_x002f_ClusterId == x).length;

            } else {
                itemcount = items.filter(z => z.InitiativeId == x).length;
            }
            Groups.push({
                key: "group" + index,
                name: x,
                startIndex: prevcount,
                count: itemcount
            })
            prevcount = prevcount + itemcount
        });
        return Groups;
    }
    public getRecentInitiative(context: SPHttpClient, _programs: any): Promise<any> {
        const array: any = [];
        return new Promise<any>(async (resolve, reject) => {
            _programs.map(z => {
                let geturl: string = this.baseUrl + "/_api/web/lists/GetByTitle('" + this.submissionList + "')/items?$select=Title,Id,ProgramsId,Overall_x0020_Trend,Support_x0020__x002f__x0020_Atte&$expand=ProgramsId&$filter=ProgramsId eq '" + z.Id + "'";
                context
                    .get(geturl, SPHttpClient.configurations.v1).then(
                        (Response: SPHttpClientResponse) => {
                            Response.json().then((results: any) => {
                                console.log('top records', results.value);
                                array.push(results.value[0])
                            });

                        }, (error: any): void => {
                            reject("error ocuured" + error);
                        }
                    );
            });
            resolve(array);
        });

    }
    public topReports(context: SPHttpClient, program: any): Promise<any> {
        var items: any = [];
        return new Promise<any>((resolve, reject) => {
            program.map((value: any) => {
                let geturl: string = this.baseUrl + "/_api/web/lists/GetByTitle('" + this.submissionList + "')/items?";
                geturl = geturl + "&select=Created,Id,Title";
                geturl = geturl + "&$filter=Programs eq '" + value.Id + "'";
                geturl = geturl + "&$orderby=Created desc&$top=1";
                console.log('url', geturl, value);
                context
                    .get(geturl, SPHttpClient.configurations.v1).then(
                        (Response: SPHttpClientResponse) => {
                            Response.json().then((results: any) => {
                                console.log('recent records for need attention', results);
                                if (results.value[0]) {
                                    results.value[0].ProgramsId = value.Title;
                                    items.push(results.value[0]);
                                }
                            });
                        }
                    );
            })
            resolve(items);
        })
    }


    public getChoicesone(context: SPHttpClient): Promise<IDropdownOption[]> {
        let geturl: string = "https://sticsoftio.sharepoint.com/sites/POC/_api/web/lists/GetByTitle('ChoiceMaster')/items?$select=Title";
        var firstchoices: IDropdownOption[] = [];
        let choicecount: number;
        return new Promise<IDropdownOption[]>(async (resolve, reject) => {
            context
                .get(geturl, SPHttpClient.configurations.v1).then(
                    (Response: SPHttpClientResponse) => {
                        Response.json().then((results: any) => {
                            results.value.map((result: any) => {
                                firstchoices.push({
                                    key: result.Title, text: result.Title,
                                });

                            });
                        });
                        resolve(firstchoices);
                    }, (error: any): void => {
                        reject("error ocuured" + error);
                    }
                );
        });
    }

    public getGrouping1(context: SPHttpClient): Promise<IGroup[]> {
        //let geturl:string=context.pageContext.web.absoluteUrl+"/_api/web/lists/GetByTitle('"+this.submissionList+"')/Items?$orderby=Initiative asc";
        let geturl: string = this.baseUrl + "/_api/web/lists/GetByTitle('" + this.submissionList + "')/Items?";
        geturl = geturl + "&select=*";
        geturl = geturl + "&$orderby=ID desc";
        //let geturl:string=context.pageContext.web.absoluteUrl+"/_api/web/lists/GetByTitle('"+this.submissionList+"')/Items?$select=Initiative&$filter=Initiative eq'"+Group+"'";
        var Groups: IGroup[] = [];
        const _groupfield = [];
        let itemcount: number;
        let prevcount = 0;
        const val = new Promise<any>(async (resolve, reject) => {
            context
                .get(geturl, SPHttpClient.configurations.v1).then(
                    (Response: SPHttpClientResponse) => {
                        Response.json().then((results: any) => {
                            results.value.map((result: any) => {
                                itemcount = results.value.length;
                                if (_groupfield.indexOf(result.InitiativeId) === -1) {
                                    console.log('inside main result', result);
                                    _groupfield.push(result.InitiativeId);
                                    itemcount = results.value.length;
                                }
                            })
                        });
                        resolve(Groups);
                    }, (error: any): void => {
                        reject("error ocuured" + error);
                    }
                );
        });
        console.log('real val', val);
        return val;
    }


    public async getGroupingLable(context: SPHttpClient): Promise<string[]> {
        let geturl: string = this.baseUrl + "/_api/web/lists/GetByTitle('" + this.submissionList + "')/Items?";
        geturl = geturl + "&select=Initiative";
        geturl = geturl + "&$orderby=Initiative";
        const _groupfield = [];
        await context
            .get(geturl, SPHttpClient.configurations.v1).then(
                (Response: SPHttpClientResponse) => {
                    Response.json().then((results: any) => {
                        results.value.map((result: any) => {
                            console.log('test-', result);
                            console.log('test2', HTMLReactParser(result.Key_x0020_Achievements));
                            //itemcount=results.value.length;
                            if (_groupfield.indexOf(result.InitiativeId) === -1) {
                                _groupfield.push(result.InitiativeId);
                            }
                        });
                    });
                }).catch(error => {
                    console.log('error', error);
                });
        return _groupfield;
    }



    public createItem(context: SPHttpClient, _listinitiate: ISubmission): Promise<any> {
        console.log('list initiate', _listinitiate);
        let posturl: string = this.baseUrl + "/_api/web/lists/GetByTitle('" + this.submissionList + "')/Items";
        var body: string;
        if (this.type == '1') { delete _listinitiate.ProgramsId };

        if (this.type != '2' && this.type != '3') {
            body = JSON.stringify(_listinitiate);

        } else {
            body = JSON.stringify(_listinitiate)
        }
        const options: ISPHttpClientOptions = {
            headers: {
                Accept: "application/json;odata=nometadata",
                "content-type": "application/json;odata=nometadata",
                "odataverion": ""
            },
            body: body,
        };
        return new Promise<any[]>(async (resolve, reject) => {
            console.log('options', posturl, options);
            context.post(posturl, SPHttpClient.configurations.v1, options).then(
                (result: any) => {
                    resolve(result);
                }
            );
        });
    }



    public deleteItem(context: SPHttpClient, selecteditems: IObjectWithKey[]): Promise<ISubmission[]> {
        let geturl: string = this.baseUrl + "/_api/web/lists/GetByTitle('" + this.submissionList + "')/items";
        var items: ISubmission[] = [];
        var close: boolean = false;
        const options: ISPHttpClientOptions = {
            headers: {
                'Accept': "application/json;odata=nometadata",
                "content-type": "application/json;odata=nometadat",
                "odataverion": "",
                'IF-MATCH': "*",
                'X-HTTP-Method': 'DELETE',
            },
        };
        return new Promise<ISubmission[]>(async (resolve, reject) => {
            selecteditems.map((selecteditem: any) => {
                context.post(geturl + "(" + selecteditem.id + ")", SPHttpClient.configurations.v1, options).then(
                    () => {
                        context.get(geturl, SPHttpClient.configurations.v1).then(
                            (Response: SPHttpClientResponse) => {
                                Response.json().then((results: any) => {
                                    results.value.map((result: any) => {

                                        //console.log(items.Title);
                                    });

                                });
                                resolve(items);
                            }, (error: any): void => {
                                reject("error ocuured" + error);
                            }
                        );
                    }
                );
            });
        });
    }

    public updateItem(context: SPHttpClient, _listinitiate: ISubmission, selecteditems: IObjectWithKey[]): Promise<ISubmission[]> {
        let posturl: string = this.baseUrl + "/_api/web/lists/GetByTitle('" + this.submissionList + "')/items";

        let geturl: string = this.baseUrl + "/_api/web/lists/GetByTitle('" + this.submissionList + "')/Items?";
        geturl = geturl + "&select=*";
        geturl = geturl + "&$orderby=Initiative";

        var items: ISubmission[] = [];
        var close: boolean = false;
        const body: string = JSON.stringify({

        });
        const options: ISPHttpClientOptions = {
            headers: {
                'Accept': "application/json;odata=nometadata",
                "content-type": "application/json;odata=nometadat",
                "odataverion": "",
                'IF-MATCH': "*",
                'X-HTTP-Method': 'MERGE',
            },
            body: body
        };
        return new Promise<ISubmission[]>(async (resolve, reject) => {
            selecteditems.map((selecteditem: any) => {
                context.post(posturl + "(" + selecteditem.id + ")", SPHttpClient.configurations.v1, options).then(
                    () => {
                        context.get(geturl, SPHttpClient.configurations.v1).then(
                            (Response: SPHttpClientResponse) => {
                                Response.json().then((results: any) => {
                                    results.value.map((result: any) => {

                                        //console.log(items.Title);
                                    });

                                });
                                resolve(items);
                            }, (error: any): void => {
                                reject("error ocuured" + error);
                            }
                        );
                    }
                );
            });
        });
    }

    public getinitiativeitems(context: SPHttpClient, program: any): Promise<Analysis> {

        //let geturl: string = context.pageContext.web.absoluteUrl+"/_api/web/lists/GetByTitle('"+this.submissionList+"')/Items?";
        let geturl: string = this.baseUrl + "/_api/web/lists/GetByTitle('" + this.submissionList + "')/items?";
        geturl = geturl + "&select=*";
        geturl = geturl + "&$filter=Programs eq '" + program + "'";
        geturl = geturl + "&$orderby=Initiative";
        var data: Array<number> = []
        var items: ISubmission[] = []; 0
        let analysis = new Analysis();
        return new Promise<Analysis>(async (resolve, reject) => {
            await context
                .get(geturl, SPHttpClient.configurations.v1).then(
                    (Response: SPHttpClientResponse) => {
                        Response.json().then((results: any) => {
                            console.log('submission anyly reports', results);
                            analysis.Initiative = results.value;
                            results.value.map((result: any, index) => {
                                // scope
                                switch (result.Scope_x0020_Status) {
                                    case 'Minor issues threatening schedule and / or goals': {
                                        analysis.Data[0].Status.datasets[0].data[0] += 1;
                                        break;
                                    }
                                    case 'On schedule': {
                                        analysis.Data[0].Status.datasets[0].data[1] += 1;
                                        break;
                                    }
                                    case 'Behind schedule and/or goals are risk': {
                                        analysis.Data[0].Status.datasets[0].data[2] += 1;
                                        break;
                                    }
                                }
                                switch (result.Scope_x0020_Trend) {
                                    case 'Stable': {
                                        analysis.Data[0].Trend.datasets[0].data[0] += 1;
                                        break;
                                    }
                                    case 'Trending up': {
                                        analysis.Data[0].Trend.datasets[0].data[1] += 1;
                                        break;
                                    }
                                    case 'Trending down': {
                                        analysis.Data[0].Trend.datasets[0].data[2] += 1;
                                        break;
                                    }
                                }
                                // schedule
                                switch (result.Schedule_x0020_Status) {
                                    case 'Minor issues threatening schedule and / or goals': {
                                        analysis.Data[1].Status.datasets[0].data[0] += 1;
                                        break;
                                    }
                                    case 'On schedule': {
                                        analysis.Data[1].Status.datasets[0].data[1] += 1;
                                        break;
                                    }
                                    case 'Behind schedule and/or goals are risk': {
                                        analysis.Data[1].Status.datasets[0].data[2] += 1;
                                        break;
                                    }
                                }
                                switch (result.Schedule_x0020_Trend) {
                                    case 'Stable': {
                                        analysis.Data[1].Trend.datasets[0].data[0] += 1;
                                        break;
                                    }
                                    case 'Trending up': {
                                        analysis.Data[1].Trend.datasets[0].data[1] += 1;
                                        break;
                                    }
                                    case 'Trending down': {
                                        analysis.Data[1].Trend.datasets[0].data[2] += 1;
                                        break;
                                    }
                                }
                                // business
                                switch (result.Budget_x0020_Status) {
                                    case 'Minor issues threatening schedule and / or goals': {
                                        analysis.Data[2].Status.datasets[0].data[0] += 1;
                                        break;
                                    }
                                    case 'On schedule': {
                                        analysis.Data[2].Status.datasets[0].data[1] += 1;
                                        break;
                                    }
                                    case 'Behind schedule and/or goals are risk': {
                                        analysis.Data[2].Status.datasets[0].data[2] += 1;
                                        break;
                                    }
                                }
                                switch (result.Budget_x0020_Trend) {
                                    case 'Stable': {
                                        analysis.Data[2].Trend.datasets[0].data[0] += 1;
                                        break;
                                    }
                                    case 'Trending up': {
                                        analysis.Data[2].Trend.datasets[0].data[1] += 1;
                                        break;
                                    }
                                    case 'Trending down': {
                                        analysis.Data[2].Trend.datasets[0].data[2] += 1;
                                        break;
                                    }
                                }
                                // overall
                                switch (result.Overall_x0020_Status) {
                                    case 'Minor issues threatening schedule and / or goals': {
                                        analysis.Data[3].Status.datasets[0].data[0] += 1;
                                        break;
                                    }
                                    case 'On schedule': {
                                        analysis.Data[3].Status.datasets[0].data[1] += 1;
                                        break;
                                    }
                                    case 'Behind schedule and/or goals are risk': {
                                        analysis.Data[3].Status.datasets[0].data[2] += 1;
                                        break;
                                    }
                                }
                                switch (result.Overall_x0020_Trend) {
                                    case 'Stable': {
                                        analysis.Data[3].Trend.datasets[0].data[0] += 1;
                                        break;
                                    }
                                    case 'Trending up': {
                                        analysis.Data[3].Trend.datasets[0].data[1] += 1;
                                        break;
                                    }
                                    case 'Trending down': {
                                        analysis.Data[3].Trend.datasets[0].data[2] += 1;
                                        break;
                                    }
                                }

                            });
                        });
                        resolve(analysis);
                    }, (error: any): void => {
                        reject("error ocuured" + error);
                    }
                );
        });
    }
    public getTrends(context: SPHttpClient, initiative: any, count: number): Promise<any> {
        let reportList = new Array<Category>();
        let trendList = new TrendAnalysis();
        let geturl: string = this.baseUrl + "/_api/web/lists/GetByTitle('" + this.submissionList + "')/items?";
        geturl = geturl + "&select=*";
        geturl = geturl + "&$filter=Initiative eq '" + initiative + "'";
        geturl = geturl + "&$orderby=Created&$top=" + count;
        return new Promise<any>(async (resolve, reject) => {
            context
                .get(geturl, SPHttpClient.configurations.v1).then(
                    (Response: SPHttpClientResponse) => {
                        Response.json().then((results: any) => {
                            trendList.Initiative = results.value;
                            results.value.map((x: any, index) => {
                                console.log('trendddd', x);
                                trendList.Dates[index] = moment(x.Created, 'DD-MM-YYYY').format('MMMM Do').toString();
                                switch (x.ScopeTrend) {
                                    case 'Trending up': {
                                        console.log('Trending up0', trendList.Counts, index);
                                        trendList.Counts[index] = trendList.Counts[index] + 1; break;
                                    }
                                    case 'Trending down': { trendList.Counts[index] = trendList.Counts[index] + 1; break; }
                                    case 'Stable': { trendList.Counts[index] = trendList.Counts[index] + 1; break; }
                                }
                            })
                            resolve(trendList);
                        });
                    }, (error: any): void => {
                        reject("error ocuured" + error);
                    }
                );
        });
    }
    public getCurrentUser(webcontext: WebPartContext, context: SPHttpClient): Promise<any> {
        let user: any;
        const payload: string = JSON.stringify({
            'logonName': webcontext.pageContext.user.email
        });
        var postData: ISPHttpClientOptions = {
            body: payload
        };
        let geturl: string = this.baseUrl + "/_api/web/ensureuser";
        return new Promise<any>(async (resolve, reject) => {
            context
                .post(geturl, SPHttpClient.configurations.v1, postData).then(
                    (Response: SPHttpClientResponse) => {
                        Response.json().then((results: any) => {
                            console.log('user profile', results);
                            resolve(results);
                        });
                    }, (error: any): void => {
                        reject("error ocuured" + error);
                    }
                );
        });
    }
    public getCurrentProfile(context: SPHttpClient): Promise<UserProfile> {
        // const user: UserProfile;

        let geturl: string = this.baseUrl + "/_api/sp.userprofiles.peoplemanager/getmyproperties";
        return new Promise<UserProfile>(async (resolve, reject) => {
            context
                .get(geturl, SPHttpClient.configurations.v1).then(
                    (Response: SPHttpClientResponse) => {
                        Response.json().then((results: UserProfile) => {
                            console.log('user profile details', results);
                            // user.DisplayName = results.
                            resolve(results);
                        });
                    }, (error: any): void => {
                        reject("error ocuured" + error);
                    }
                );
        });

    }
    public imageVal(context: SPHttpClient, url:string) {
        console.log('Reponse');
        const val = new Promise<any>(async (resolve, reject) => {
            context
                .get(url, SPHttpClient.configurations.v1).then(
                    (Response: SPHttpClientResponse) => {
                        console.log('Reponse',Response)
                        resolve(Response);
                    }, (error: any): void => {
                        reject("error ocuured" + error);
                    }
                );
        });
        console.log('valll', val);
    }
}