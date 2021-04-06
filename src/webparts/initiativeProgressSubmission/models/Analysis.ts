export class Analysis{
    public Data: any =[Scope,Schedule,Business,Overall];
    public Initiative:any = [];
    constructor(){
        this.Data[0] = new Scope();
        this.Data[1] = new Schedule();
        this.Data[2] = new Business();
        this.Data[3] = new Overall();
    }
}

export class Scope{
    public Text: string = 'Scope';
    public Status: Status;
    public Trend: Trend;
    constructor(){
        this.Status = new Status();
        this.Trend = new Trend();
    }
}
export class Status{
    public labels = ['Minor issues', 'On Schedule','Need Help'];
    public datasets = [
        {
            data: [0, 0, 0],
            backgroundColor: [
                '#f5a31a',
                '#bceb3c',
                '#f05d23'
            ]
        }
    ];
}
export class Trend{
    public labels = ['Stable','Trending Up','Trending down'];
    public datasets = [
        {
            data: [0, 0, 0],
            backgroundColor: [
                '#0779e4',
                '#a6cb12',
                '#d32626'
            ]
        }
    ];
}
export class Schedule{
    public Text: string = 'Schedule';
    public Status: Status;
    public Trend: Trend;
    constructor(){
        this.Status = new Status();
        this.Trend = new Trend();
    }
}
export class Business{
    public Text: string = 'Business Case';
    public Status: Status;
    public Trend: Trend;
    constructor(){
        this.Status = new Status();
        this.Trend = new Trend();
    }
}
export class Overall{
    public Text: string = 'Overall';
    public Status: Status;
    public Trend: Trend;
    constructor(){
        this.Status = new Status();
        this.Trend = new Trend();
    }
}