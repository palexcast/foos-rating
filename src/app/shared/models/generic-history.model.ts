export class GenericHistoryModel {
  created: any;
  lastUpdated: any;
  winnerName: string;
  winnerOldRating: number;
  winnerNewRating: number;
  loserName: string;
  loserOldRating: number;
  loserNewRating: number;

  constructor(props) {
    this.created = props.created;
    this.lastUpdated = props.lastUpdated;
    this.winnerName = props.team1Name;
    this.winnerOldRating = props.team1OldRating;
    this.winnerNewRating = props.team1NewRating;
    this.loserName = props.team2Name;
    this.loserOldRating = props.team2OldRating;
    this.loserNewRating = props.team2NewRating;
  }

}
