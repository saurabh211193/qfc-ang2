import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  _pagination: any;
  @Input()
  set pagination(pagination: any) {
    this._pagination = pagination;
    console.log(this._pagination)
  }
  get pagination() {
    return this._pagination;
  }

  @Output() PageChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  PageChanged(event) {
    console.log(this._pagination);
    this.PageChange.emit(this._pagination);
  }


}
