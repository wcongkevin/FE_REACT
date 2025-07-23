export class Monitoring {
  public user_id: string = sessionStorage.getItem("user_email");
  public market: Array<string> = [];
  public division: Array<string> = [];
  public retailer: Array<string> = [];
  public end_date: string = "";
  public start_date: string = "";
  constructor(
    user_id: string = sessionStorage.getItem("user_email") || "",
    market: Array<string> = [],
    division: Array<string> = [],
    retailer: Array<string> = [],
    end_date: string = "",
    start_date: string = ""
  ) {
    this.user_id = user_id;
    this.market = market;
    this.division = division;
    this.retailer = retailer;
    this.end_date = end_date;
    this.start_date = start_date;
  }
}
