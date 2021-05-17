import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MailService } from './../../services/mail.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {

  activated: Boolean = false;
  message: String = 'Activation in process please wait...';
  token: String = '';

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private mailService: MailService) { }

  ngOnInit() {
    const token = this.activatedRoute.snapshot.queryParams['key'];

    this.mailService.activateMail(token).subscribe(
      data => this.activated = true,
      error => this.message = error.error.message
    );
  }

  moveToLogin() {
    this.router.navigate(['/login']);
  }

}
