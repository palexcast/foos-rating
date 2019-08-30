import {Component, OnInit} from '@angular/core';
import {GenericHistoryModel} from '../../shared/models/generic-history.model';
import {HistoryService} from '../../shared/services/history.service';

@Component({
  selector: 'app-history',
  styleUrls: ['history.component.scss'],
  templateUrl: 'history.component.html'
})
export class HistoryComponent implements OnInit {

  history: GenericHistoryModel[];

  constructor(private historyService: HistoryService) {
  }

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.historyService.getJointHistory(20).subscribe(history => {
      this.history = history;
    }, error => {
      console.log(error);
    });
  }

}
