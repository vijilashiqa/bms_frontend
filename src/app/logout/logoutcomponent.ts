import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '../pages/_service/indexService';


@Component({
    selector: 'logout',
    templateUrl: './logoutcomponent.html'
})

export class LogoutComponent implements OnInit {
    submit: boolean = false;
    constructor(
        private router: Router,
        private service: LogService) { }

    logout() {
        this.service.logout();
        this.router.navigate(['/auth/login']);
        // deleteCookie("username");
    }
    ngOnInit() {
        this.logout();
    }
}

