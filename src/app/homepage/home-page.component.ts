import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Http, RequestOptions, Headers, HttpModule  } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public testRun;
  public testCases;
  public testSuiteName: string;
  public testId: string;
  public testCaseId: string;
  public tempHide;
  public errors: any;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.testId = params.id;
      this.testCaseId = params.tcId;
      this.tempHide = false;
    });
  }

  ngOnInit() {
  }
}
