import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first, tap } from 'rxjs/operators';
import { AuthService } from './../../services/auth.service';
import { UsersService } from './../../services/user.service';
import { User } from './../../models/user.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  returnUrl: string;
  loading: boolean;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public userService: UsersService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // this.authService.logout();
    this.loading = false;
  }

  register() {
    this.router.navigate(['/signup']);
  }

  get formControls() { return this.loginForm.controls; }

  onSubmit() {
    this.loading = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.formControls.email.value, this.formControls.password.value)
    .pipe(
      first()
    )
    .subscribe(
      data => {
        this.router.navigate(['/home']);
        this.loading = false;
      },
      error => {
        console.log(error);
        this.error = error;
        this.loading = false;
      }
    );
  }

}
