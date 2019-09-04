import {Component, OnInit} from '@angular/core';
import {MatchModel} from '../../shared/models/match.model';
import {MatchmakerService} from '../../shared/services/matchmaker.service';
import {AuthenticationService} from '../../shared/services/authentication.service';

@Component({
  selector: 'app-games',
  styleUrls: ['games.component.scss'],
  templateUrl: 'games.component.html'
})
export class GamesComponent implements OnInit {
  matches: MatchModel[];
  loadingMatchId: string;
  myId: string;

  constructor(private matchmaker: MatchmakerService, private auth: AuthenticationService) {
  }

  ngOnInit() {
    this.getMyId();
    this.loadMatches();
  }

  getMyId() {
    this.auth.isLoggedIn().subscribe(result => {
      this.myId = result.uid;
    });
  }

  registerWinner(player1Won: boolean, match: MatchModel) {
    this.loadingMatchId = match.id;
    this.matchmaker.registerWinner(player1Won, match).then(() => {
      this.loadingMatchId = null;
      console.log('match complete');
    }, error => {
      this.loadingMatchId = null;
      console.log(error);
    });
  }

  deleteMatch(match: MatchModel) {
    if (!match.id) {
      return;
    }
    if (!confirm('Are you sure?')) {
      console.log('abort');
      return;
    }
    this.loadingMatchId = match.id;
    this.matchmaker.deleteMatch(match).then(() => {
      this.loadingMatchId = null;
      console.log('delted');
    }, err => {
      this.loadingMatchId = null;
      console.log(err);
    });
  }

  private loadMatches() {
    this.matchmaker.getMatchesByDate().subscribe(result => {
      this.matches = result;
    }, error => {
      console.log(error);
    });
  }
}
