import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-multiselect-dropdown',
  templateUrl: './multiselect-dropdown.component.html',
  styleUrls: ['./multiselect-dropdown.component.css']
})
export class MultiselectDropdownComponent implements OnInit, OnChanges {

  _data: any;
  @Input('data') data: any;
  @Input('settings') settings: any;
  @Input('selected_data') selected_data: any;

  @Output() getSelectedItem = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  onItemSelect(event) {
    this.getSelectedItem.emit(this.selected_data);
  }

  onSelectAll(event) {
    this.selected_data = event;
    this.getSelectedItem.emit(this.selected_data);
  }

  onItemDeSelect(event) {
    this.getSelectedItem.emit(this.selected_data);
  }

  onDeSelectAll(event) {
    this.selected_data = []
    this.getSelectedItem.emit(this.selected_data);
  }

}
