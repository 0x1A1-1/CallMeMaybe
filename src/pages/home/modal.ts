import { Component } from '@angular/core';
import {  Platform, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { Contacts } from '@ionic-native/contacts';

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html'
})

export class ModalContentPage {
  // character;
  user;
  input;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public storage: Storage,
    public alertCtrl: AlertController,
    private contacts: Contacts
  ) {

    //construct modal based on user
    if (this.params.get('new')==1){
      var newUser =   {
          id: '',
          name: '',
          freq: '',
          nextDate: '',
          cell: '',
        };
      this.user = newUser;
    }else{
      this.user = this.params.get('user')
    };
    //clone object
    this.input = (JSON.parse(JSON.stringify(this.user)));
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  //save validation
  saveValid(){
    console.log(this);
    if(this.user.freq!=this.input.freq && this.user.id!=""){
      let alert = this.alertCtrl.create({
        title: 'Frequency Changed',
        subTitle: 'Next contact day will in '+this.input.freq+' days from today!',
        buttons: [
          {
            text: 'Cancel',
          },
          {
            text: 'Save',
            handler: data => {
              this.save(true);
            }
          }
        ]
      });
      alert.present();
    }else{ //if frequency is kept the same or user is new
      this.save(false);
    }
  }

  //save reminder listing
  save(updatefrequency){
      //read value from form
      this.user.name=this.input.name;
      this.user.freq=this.input.freq;
      this.user.cell=this.input.cell;

      //update when storage is ready
      this.storage.ready().then(() => {

        //if this is a new reminder, construct id
        if(this.user.id==""){

          //set next contacting date for new user
          var nextDate = new Date();
          nextDate.setDate(new Date().getDate() + parseInt(this.user.freq));
          this.user.nextDate = nextDate;

          //set the id for new entry base on max index
          this.storage.keys().then(result =>{

            if(result.length==0){
              this.user.id = 1 ;
            }else{
              this.user.id = parseInt(result[result.length-1])+1;
            }

            this.storage.set(this.user.id, this.user);
            this.viewCtrl.dismiss(this.user);
          })
        }
        else{
          //if user update existing frequency
          if(updatefrequency == true){
            var nextDate = new Date();
            nextDate.setDate(new Date().getDate() + parseInt(this.user.freq));
            this.user.nextDate = nextDate;
            this.user.days = this.user.freq;
          }

          //update existing
          this.storage.set(this.user.id, this.user);
          this.viewCtrl.dismiss();
        }
      });
  }

  //import contact
  import(){
    this.contacts.pickContact().then((contact) => {
      this.input.name =  contact.name.formatted;
      this.input.cell =  contact.phoneNumbers[0].value;
    })

  }

  //delete reminder listing
  delete(){
    this.storage.ready().then(() => {
      this.storage.remove(this.user.id).then(()=>{
        this.viewCtrl.dismiss(this.user);
      })
    })
  }
}
