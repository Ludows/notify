(function(root, factory){
// AMD Support
if (typeof define === 'function' && define.amd) {
  define([], factory(root));
}
// RequireJS Support
else if ( typeof exports === 'object') {
  module.exports = factory(root);
}
// Browser Support
else {
  root.Notify = factory(root);
}

})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {

  'use strict';

var Notify = {};
var supports = !!document.querySelector && !!root.addEventListener; // Feature test
var wrapper_notif;
var wrapper_notif_arr;
var type_message;
var wrapper_notif_length;
var the_class_type;
var the_class_message;
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




var defaults = {
  position : 'right',
  element : '#notify',
  classmessage : '.notify',
  closebtn: true,
  message: 'Toto',
  type: 'success',
  placement: 'right',
  timerMessage: 1000
}


function extend( a, b ) {
  for( var key in b ) { 
    if( b.hasOwnProperty( key ) ) {
      a[key] = b[key];
    }
  }
  return a;
}


Notify.init = function(options) {

  if (arguments[0] && typeof arguments[0] == "object"){
    this.options = extend( defaults, arguments[0])
    // extend( this.options, options)    
  } else {
    this.options = defaults;
  }

  wrapper_notif_length = this.options.element.length;
  type_message = this.options.type;
  the_class_message = this.options.classmessage;
  the_time = this.options.timerMessage;
  the_message =  this.options.message ;



  if (wrapper_notif_length != 0) {

    wrapper_notif = document.querySelector(this.options.element);

    query_placement_attr = wrapper_notif.getAttribute('data-position');
    the_condition_pos = query_placement_attr === 'left' || query_placement_attr === 'right' || query_placement_attr.length > 0 || query_placement_attr != 'undefined'
// Ici je génère au cas ou si le data-position n'est pas présent sur le wrapper des notifications
if ( !the_condition_pos ) {
  wrapper_notif.setAttribute('data-position', this.options.placement)
}


_theMessageTpl();
// this._event()

}
else {
  throw new Error('Le script ne peut pas être lancé. La classe ou l\'id est manquante sur le conteneur de notifications') 
}



}

function _theMessageTpl() {
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
switch(type_message) {
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
the_tpl_message_content = document.createElement('p');
the_tpl_message_content.innerHTML = _theMessage();
the_tpl_message.appendChild(the_tpl_message_content);
// the_tpl_message = "<div id="+ guid() +" class='notify notify-open "+ the_class_type +"'>"+ this._theMessage() +"</div>"
// console.log('the wrapper notif', wrapper_notif);
// console.log('the message Tpl', the_tpl_message);

// Création d'un array pour stocker chaque notifications que je redistribue dans le DOM avec la boucle forEach
the_tpl_message_arr = new Array();
the_tpl_message_arr.push(the_tpl_message);
console.log('tpl-message-arr', the_tpl_message_arr);
// On init le timer de l'object options.timerMessage

the_tpl_message_arr.forEach(function(element, index){

  wrapper_notif.appendChild(element);
})



// Ici je récuère toutes les notifications générées dans le dom et 
// transformé en Array enfin de passer l'élément
// Pour l'anim de fin de la notification.
the_notif = document.querySelectorAll(the_class_message);
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
// element.parentNode.removeChild(element);
get_support_remove(element);
// the_notif_arr.splice(index, 1);
}, the_time + 500)
})

console.log('the notif arr', the_notif_arr);
}

function _theMessage() {
  return the_message;
}

function get_support_remove(element) {
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }
  else {
    element.remove();
  }
}


return Notify;




})
