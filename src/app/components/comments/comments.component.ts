import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { GlobalService, UserConfig } from '../../services/global.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  userDetails: UserConfig;
  commentForm: FormGroup;

  @Input('comments') comments: any[];
  @Output() saveComment = new EventEmitter();

  constructor(private fb: FormBuilder, private globalService: GlobalService) { }

  ngOnInit() {
    this.userDetails = this.globalService.getUserCredential()['userData'];

    this.commentForm = this.fb.group({
      Comments: [''],
      CommentSource: ['QFC'],
      CommentType: [1],
      UserId: [this.userDetails.UserId]
    });
  }

  save() {
    this.saveComment.emit(this.commentForm.value);
    this.commentForm.controls['Comments'].setValue(null);
  }

}
