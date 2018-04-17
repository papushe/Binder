import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from "rxjs";
import {SharedService} from "../shared/shared.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private sharedService: SharedService){

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      req = req.clone({
        setHeaders: {
          Authorization: this.sharedService.getToken()}
      });
    return next.handle(req);
  }
}


