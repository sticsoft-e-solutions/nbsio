export class Counts{
    public All: All;
    public User: User;
    constructor(){
        this.All = new All();
        this.User = new User();
    }
}
export class All{
    public OnSchedule = 0;
    public MinurIssues = 0;
    public NeedHelp = 0;
    public TrendingUp = 0;
    public Stable = 0;
    public TrendingDown = 0;
}
export class User{
    public OnSchedule = 0;
    public MinurIssues = 0;
    public NeedHelp = 0;
    public TrendingUp = 0;
    public Stable = 0;
    public TrendingDown = 0;
}