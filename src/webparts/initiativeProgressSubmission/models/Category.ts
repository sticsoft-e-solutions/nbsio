export class Category{
    public Programs: string;
    public Initiative: string;
    public ScopeTrend: string;
    public ScheduleTrend: string;
    public BusinessCaseTrend: string;
    public OveralTrend: string;
    public ScopeStatus: string;
    public ScheduleStatus: string;
    public BusinessCaseStatus: string;
    public OverallStatus: string;
    public Created: string;
    public Status: boolean = false;
    public Count: number = 0;
    public keyachievementsinperiod: string;
    public keyactivitiesfornextperiod: string;
    public supportattentionneeded: string;

}
export class TrendAnalysis{
    public Dates = ['','',''];
    public Counts = [0,0,0];
    public Initiative :any;

}