(function(){

  'use strict';
  var wrapper_notif;
  var wrapper_notif_arr;
  var wrapper_notif_length;
  var the_class_type;
  var the_class_type_arr;
  var the_tpl_message;
  var the_tpl_message_arr;
  var the_message;
  var query_placement_attr;
  var the_condition_pos;
  var the_notif;
  var the_notif_arr;
  var the_tpl_message_content;
  var the_time
  
  /**
   * Extend obj function
   *
   * This is an object extender function. It allows us to extend an object
   * by passing in additional variables and overwriting the defaults.
   */
  function extend( a, b ) {
    for( var key in b ) { 
      if( b.hasOwnProperty( key ) ) {
        a[key] = b[key];
      }
    }
    return a;
  }

  /**
   * Notify
   *
   * @param {object} options - The options object
   */
  function Notify(options) {
    this.options = extend( {}, this.options)
    extend( this.options, options)
    this._construct();
  }
  /**
   * Loady options Object
   *
   * @type {HTMLElement} wrapper - The wrapper to append alerts to.
   * @param {string} type - The type of alert.
   * @param {string} message - The alert message.
   */

   Notify.prototype.options = {
    position : 'right',
    element : '#notify',
    classmessage : '.notify',
    message: 'Toto',
    type: 'success',
    placement: 'right',
    timerMessage: 1000
  }

  Notify.prototype._construct = function() {
      wrapper_notif_length = this.options.element.length
      var the_condition = this.options.element === '#' && this.options.element.length >= 1 || this.options.element === '.' && this.options.element.length >= 1
      // Ici je gère quelques erreurs classiques lors d'une intégration possible du script
      if (wrapper_notif_length != 0  && !the_condition) {
          
          wrapper_notif = document.querySelector(this.options.element);
          
          query_placement_attr = wrapper_notif.getAttribute('data-position');
          the_condition_pos = query_placement_attr === 'left' || query_placement_attr === 'right' || query_placement_attr.length > 0 || query_placement_attr != 'undefined'
          // Ici je génère au cas ou si le data-position n'est pas présent sur le wrapper des notifications
          if ( !the_condition_pos ) {
              wrapper_notif.setAttribute('data-position', this.options.placement)
          }


          this._theMessageTpl();
          // this._event()

      }
      else if (wrapper_notif_length === 0 || this.options.element === 'undefined' || this.options.element === '')  {
        console.error('Le conteneur du système de notif n\'est pas spécifié ou n\'est pas sélectionné');
      }
      else if (the_condition) {
        console.error('Le conteneur du système de notif n\'est pas bien spécifié. L\'id ou la classe voire L\'élement HTML doit être mieux spécifié');
      }

      

      
  }
  Notify.prototype._theMessageTpl = function() {
      // console.log('the message')
      // Ici une petite function pour générer un identifiant unique par une id
      function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
      }
      // Ici on gère la classe à donner lorsque l'options.type est déclaré dans l'objet
      switch(this.options.type) {
          case 'success' :
            // document.createElement('div').setAttribute('class', 'notify notifiy-success');
            the_class_type = 'notify-success';
            break;
          case 'info' :
            the_class_type = 'notify-info';
            break;
          case 'warning' :
            the_class_type = 'notify-warning';
            break;
          case 'danger' :
            the_class_type = 'notify-danger';
            break;

        }
        // the_class_type_arr = Array.prototype.slice.call(the_class_type);
          // wrapper_notif.setAttribute('data-show','true');
          // Ici Création de la div de notification
          the_tpl_message = document.createElement('div');
          the_tpl_message.className = "notify notify-open "+ the_class_type +" "
          the_tpl_message.id = guid();
          the_tpl_message_content = document.createElement('h5');
          the_tpl_message_content.innerHTML = this._theMessage();
          the_tpl_message.appendChild(the_tpl_message_content);
          // the_tpl_message = "<div id="+ guid() +" class='notify notify-open "+ the_class_type +"'>"+ this._theMessage() +"</div>"
          // console.log('the wrapper notif', wrapper_notif);
          // console.log('the message Tpl', the_tpl_message);

          // Création d'un array pour stocker chaque notifications que je redistribue dans le DOM avec la boucle forEach
          the_tpl_message_arr = new Array();
          the_tpl_message_arr.push(the_tpl_message);
          console.log('tpl-message-arr', the_tpl_message_arr);
          // On init le timer de l'object options.timerMessage
          the_time = this.options.timerMessage;

          the_tpl_message_arr.forEach(function(element, index){

            wrapper_notif.appendChild(element);
          })


        
        // Ici je récuère toutes les notifications générées dans le dom et 
        // transformé en Array enfin de passer l'élément
        // Pour l'anim de fin de la notification.
        the_notif = document.querySelectorAll(this.options.classmessage);
        the_notif_arr = Array.prototype.slice.call(the_notif);
        if (the_notif_arr.length > 0) {
          wrapper_notif.setAttribute('data-show','true');
        }
        else if (the_notif_arr.length === 0) {
          wrapper_notif.setAttribute('data-show', 'false');
          // A corriger dans la v2
        }


        the_notif_arr.forEach(function(element, index) {
          setTimeout(function(){
            element.className = 'notify '+ the_class_type +' notify-close ';
          }, the_time)
          setTimeout(function(){
            element.remove();
          }, the_time + 500)
        })
        console.log('the notif arr', the_notif_arr);
        
  }
  Notify.prototype._theMessage = function() {
      the_message =  this.options.message ;
      return the_message;
  }



  window.Notify = Notify;

})(window);