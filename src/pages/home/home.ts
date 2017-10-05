import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController, ItemSliding } from 'ionic-angular';
import { ModalContentPage } from './modal';
import { Storage } from '@ionic/storage';
import { CallNumber} from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  users;
  msg;

  constructor(
  public modalCtrl: ModalController,
  public platform: Platform,
  public params: NavParams,
  public viewCtrl: ViewController,
  public storage: Storage,
  private callNumber: CallNumber,
  private sms: SMS
  ) {
    var today = new Date();
    storage.ready().then(() => {
           storage.forEach((val, key, index)=>{
             //get next date to contact
             var nextDate = new Date(val.nextDate);
             //calc remaining days
             val.days =  Math.round((nextDate.getTime() - today.getTime())/(1000 * 60 * 60 * 24));
             val.past = false;
             //show danger text for past due date contact
             if(val.days<0){
               val.days *= -1;
               val.past = true;
             }

             users.push(val);
             this.sort();
             });
       });


    var day = new Date();
    day.setDate(new Date().getDate() + 3);
    //placeholder starting value
    var users = [
      {
        id:"1",
        name: 'John Doe',
        freq: '3',
        days: '2',
        past: false,
        nextDate: day,
        cell: '1111111111',
      }
    ];
    this.users = users;
    // this.msg = new Date();
  }

  //editing existing reminder
  openModal(user) {
    let modal = this.modalCtrl.create(ModalContentPage, user);
    modal.onDidDismiss(data => {
      if(data != undefined) {
        for(var i = 0; i < this.users.length; i++) {
            var obj = this.users[i];
            if(obj.id == data.id){
              this.users.splice(i, 1);
            }
        }
      }
      this.sort();
   });
    modal.present();
  }

  //create new reminder
  newModal(){
    let modal = this.modalCtrl.create(ModalContentPage, {"new":"1"});
    modal.onDidDismiss(data => {
      if(data != undefined) {
       data.past = false;
       data.days = data.freq;
       this.users.push(data);
       this.sort();
      }
   });
    modal.present();
  }

  //call desinated contact
  call(number){
    this.callNumber.callNumber(number.cell, true)
      .then(() => this.msg = 'Launched dialer!')
      .catch(() => this.msg = 'Error launching dialer');
  }

  //text desinated contact
  text(number){
    this.sms.send(number.cell, "How are you?")
      .then(() => this.msg = 'Text finished!')
      .catch(() => this.msg = 'Error launching text');;
  }

  //finished contacting person
  finished(slidingItem: ItemSliding, user){
    //set next contacting date for current contact
    var nextDate = new Date();
    nextDate.setDate(new Date().getDate() + parseInt(user.freq));
    user.nextDate = nextDate;
    this.storage.ready().then(()=>{
      this.storage.set(user.id, user);

      //update homepage user info
      user.days = user.freq;
      user.past = false;
      slidingItem.close();
      this.sort();
    })
  }

  //sort the listing
  sort(){
    this.users.sort(function(a,b){
       //save calc time if there's a diff in past and not past
       if(a.past == false && b.past == true){
         return 1;
       }else if(a.past == true && b.past == false){
         return -1;
       }else {
         var former = (a.past == true) ? parseInt(a.days)*-1 : parseInt(a.days),
             later = (b.past == true) ? parseInt(b.days)*-1 : parseInt(b.days);
         return former - later;
       }
     });
  }

  //testing method
  // update(){
  //   this.storage.ready().then(()=>{
  //     this.storage.get("3").then((result)=>{
  //       //set next contacting date for new user
  //       var nextDate = new Date();
  //       nextDate.setDate(new Date().getDate() - 3);
  //       result.nextDate = nextDate;
  //       this.storage.set("3", result);
  //     });
  //   })
  // }

}
