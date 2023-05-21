import { Component, OnInit } from '@angular/core';
import { PostModel } from '../interface/post-model';
import { PostsService } from '../shared/posts.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: Array<PostModel>;

  constructor(
    private postService: PostsService,
    private notif: NotifierService
  ) {
    this.postService.getAllPosts().subscribe(posts => {
      this.posts = posts.data?.Posts || []; 
    }, err => {
      this.notif.notify('error', err.message);
    });
  }

  ngOnInit(): void {

  }

}
