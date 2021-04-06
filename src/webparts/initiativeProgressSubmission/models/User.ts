export class UserProfile{
    public DisplayName: string;
    public Email: string;
    public Title: string;
    public PictureUrl: string;
    public UserProfileProperties:any = [];
    constructor(){
        this.DisplayName = '';
        this.Email = '';
        this.Title = '';
        this.PictureUrl = '';
    }
}