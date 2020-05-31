import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { TouchAuth } from "../../providers/touch-auth/touch-auth";

@IonicPage()
@Component({
  selector: 'auth-page',
  templateUrl: 'auth-page.html'
})
export class AuthPage implements OnInit {

    fingerAuthType:boolean = false;
    public showSection:boolean;

    item:any = {
      user: {
        avatar: 'assets/img/marty-avatar.png',
        name: 'Marty McFly'
      },
      date: 'November 5, 1955',
      image: 'assets/img/advance-card-bttf.png',
      content: 'Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy.',
    };

    constructor(
      public navCtrl: NavController,
      public toastCtrl: ToastController,
      private touchAuth: TouchAuth
    ) {   }
    
    ngOnInit(){
      this.touchAuth.getTouchAuthResults().subscribe(this.touchAuthResults.bind(this))
    }

    touchAuthResults(data){
      this.showToast(JSON.stringify(data)); 
      this.showSection = data.isAuthenticated;
    }

    showToast(message: string){
      let toast = this.toastCtrl.create({
        message,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }

    onAuthTypeToggle(){
      if(!this.fingerAuthType) return;

      const MSG_ON = 'The fingerprint auth type for android is available';
      const MSG_OFF = 'The fingerprint auth type for android is not available';
      let { isTouchAvalible, isFingerprintAuthAvailable } = this.touchAuth.getTouchAvaliability();
      let message = isTouchAvalible && isFingerprintAuthAvailable ? MSG_ON : MSG_OFF ;

      this.showToast(message);      
      if(!isFingerprintAuthAvailable){
        setTimeout(() => {
          this.fingerAuthType = false;
        }, 0);
      }
    }

    loginWithAuthType(){
      let { fingerprintResultMsg } = this.touchAuth.getFingerPrintResults();
      this.showToast(fingerprintResultMsg);
      if(this.fingerAuthType) this.touchAuth.authenticateTouch();
    }
}