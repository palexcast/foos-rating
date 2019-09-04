import {UserModel} from './user.model';

export class MatchModel {
  id?: string;
  created: any;
  lastUpdated: any;
  player1: UserModel;
  player2: UserModel;
  winner?: UserModel;

  constructor(props) {
    this.id = props.id;
    this.created = props.created;
    this.lastUpdated = props.lastUpdated;
    this.player1 = props.player1;
    this.player2 = props.player2;
    this.winner = props.winner;
  }

}
