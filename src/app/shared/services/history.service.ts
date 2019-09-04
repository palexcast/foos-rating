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
    return new GenericHistoryModel({
      created: history.created,
      lastUpdated: history.lastUpdated,
      winnerName: history.player1Name,
      winnerOldRating: history.player1OldRating,
      winnerNewRating: history.player1NewRating,
      loserName: history.player2Name,
      loserOldRating: history.player2OldRating,
      loserNewRating: history.player2NewRating
    });
  }

  private static convertTeamHistory(history: TeamHistoryModel): GenericHistoryModel {
    return new GenericHistoryModel({
      created: history.created,
      lastUpdated: history.lastUpdated,
      winnerName: history.team1Name,
      winnerOldRating: history.team1OldRating,
      winnerNewRating: history.team1NewRating,
      loserName: history.team2Name,
      loserOldRating: history.team2OldRating,
      loserNewRating: history.team2NewRating
    });
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
