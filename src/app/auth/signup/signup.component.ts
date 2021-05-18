import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UsersService } from '../../services/user.service';
import { MailService } from '../../services/mail.service';

import {mimeType} from '../../images/mime-type.validator';

import { User } from './../../models/user.model';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  users: User[];
  user: User;
  userForm: FormGroup;
  imagePreview: string;
  imageName: string;
  fileError: Error = null;
  errorMsg: string = null;

  registerSucces = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UsersService,
    private mailService: MailService,
  ) { this.prepareForm(); }

  get formControls() { return this.userForm.controls; }
  get email() { return this.userForm.controls['email']; }
  get password() { return this.userForm.controls['password']; }
  get pseudo() { return this.userForm.controls['pseudo']; }
  get picture() { return this.userForm.controls['picture']; }

  onImagePicked(event: Event) {
    this.errorMsg = null;
    this.fileError = null;
    const file = ((event.target as HTMLInputElement).files[0] as File);
    this.userForm.get('picture').setValue(file);
    this.userForm.get('picture').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  add() {
    this.errorMsg = null;
    const inputs = this.formControls;
    this.user = {
      pseudo: inputs.pseudo.value,
      email: inputs.email.value,
      password: inputs.password.value,
      picture: inputs.picture.value,
      is_verified: false
    };
    this.userService.userAdd(this.user).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 500) {
          this.errorMsg = err.error.err.message;
          this.imagePreview = null;
          return of([]);
        } else {
          this.errorMsg = err;
          console.log(this.errorMsg);
          return of([]);
        }
      }))
      .subscribe(user => {
        console.log(this.user.email);
        if (this.errorMsg == null) {
          this.prepareForm();
          this.router.navigate(['/login']);
          this.registerSucces = true;
        }
    });


    // Mail part
    this.mailService.sendEmail('https://calm-waters-91692.herokuapp.com/api/mail/sendmail', this.user)
    .subscribe(data => {
      let res: any = data;
      console.log(`Yipee ${this.user.email} is successfully register and mail is sent for validation`);
    },
    err => {
      console.log('error mail: ', err);
    }, () => {
      console.log('mail is sent!');
    });

  }

  private prepareForm() {
    this.userForm = new FormGroup({
      name: new FormControl(null),
      email: new FormControl(null, { validators: [Validators.required]
      }),
      password: new FormControl(null, { validators: [Validators.required]
      }),
      pseudo: new FormControl(null),
      picture: new FormControl(null, { validators: [], asyncValidators: [mimeType]
      }),
    });
  }

  moveToLogin() {
    this.router.navigate(['/login']);
  }
}