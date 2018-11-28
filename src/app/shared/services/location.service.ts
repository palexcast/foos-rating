import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {LocationModel} from '../models/location.model';
import {Observable} from 'rxjs';

@Injectable()
export class LocationService {

  private locationCollection: AngularFirestoreCollection<LocationModel>

  constructor(private afs: AngularFirestore) {
  }

  getLocations(): Observable<LocationModel[]> {
    this.locationCollection = this.afs.collection<LocationModel>('locations', ref => {
      return ref.orderBy('city', 'desc');
    });
    return this.locationCollection.valueChanges();
  }
}
