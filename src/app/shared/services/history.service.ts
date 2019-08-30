import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {HistoryModel} from '../models/history.model';
import {combineLatest, Observable} from 'rxjs';
import {TeamHistoryModel} from '../models/team-history.model';
import {GenericHistoryModel} from '../models/generic-history.model';
import {map, tap} from 'rxjs/operators';

@Injectable()
export class HistoryService {

  private historyCollection: AngularFirestoreCollection<HistoryModel>;
  private teamHistoryCollection: AngularFirestoreCollection<TeamHistoryModel>;

  constructor(private afs: AngularFirestore) {
  }

  private static convertUserHistory(history: HistoryModel): GenericHistoryModel {
    const tmp = new GenericHistoryModel();
    tmp.created = history.created;
    tmp.lastUpdated = history.lastUpdated;
    tmp.winnerName = history.player1Name;
    tmp.winnerOldRating = history.player1OldRating;
    tmp.winnerNewRating = history.player1NewRating;
    tmp.loserName = history.player2Name;
    tmp.loserOldRating = history.player2OldRating;
    tmp.loserNewRating = history.player2NewRating;
    return tmp;
  }

  private static convertTeamHistory(history: TeamHistoryModel): GenericHistoryModel {
    const tmp = new GenericHistoryModel();
    tmp.created = history.created;
    tmp.lastUpdated = history.lastUpdated;
    tmp.winnerName = history.team1Name;
    tmp.winnerOldRating = history.team1OldRating;
    tmp.winnerNewRating = history.team1NewRating;
    tmp.loserName = history.team2Name;
    tmp.loserOldRating = history.team2OldRating;
    tmp.loserNewRating = history.team2NewRating;
    return tmp;
  }

  getSoloHistory(top: number): Observable<HistoryModel[]> {
    this.historyCollection = this.afs.collection<HistoryModel>('history', ref => {
      return ref.orderBy('created', 'desc').limit(top);
    });
    return this.historyCollection.valueChanges();
  }

  getTeamHistory(top: number): Observable<TeamHistoryModel[]> {
    this.teamHistoryCollection = this.afs.collection<TeamHistoryModel>('team-history', ref => {
      return ref.orderBy('created', 'desc').limit(top);
    });
    return this.teamHistoryCollection.valueChanges();
  }

  getJointHistory(top: number): Observable<GenericHistoryModel[]> {
    return combineLatest(this.getSoloHistory(top), this.getTeamHistory(top)).pipe(
      map(([userHistory, teamHistory]) => {
        return userHistory.map(h => HistoryService.convertUserHistory(h))
          .concat(teamHistory.map(h => HistoryService.convertTeamHistory(h)));
      }),
      tap(history => history.sort((a, b) => b.created - a.created)),
      map(history => history.splice(0, top)),
    );
  }

}
