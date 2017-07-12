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
  var query_container_placement_attr;
  var the_condition_pos;
  var the_notif;
  var the_notif_arr;
  var the_tpl_message_content;
  var the_time;
  var the_close_btn_opt;
  var method_message;
  var html_method;
  var btn_callback;

var defaults = {
  containerPos : 'right',//testé
  container : '#notify',//testé
  classmessage : '.notify',//testé
  animin: '',
  animout: '',
  closebtn: true,//testé bug car meme instance ^^ou voir dans l'extend qui gère l'objet
  type: 'success',//testé
  messageplacement: 'top',
  timerMessage: 1000,//testé
  messageMethod: 'text', // ou html
  message: 'Toto',//testé 
  html: '<h1>super test</h1>',//testé
  btncallback: true, // wording a ameliorer cf reférence Valider/Annuler,
  responsecallback: function() {

  }
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
    this.options = extend( {}, defaults)
    extend( this.options, options)
  // console.log('opts Notify', arguments[0])
  } else {
    this.options = defaults;
  }

  wrapper_notif_length = document.querySelector(this.options.container).length;

  // Pour que le script s'instancie correctement il faut que la classe 
  //ou l'id soit spécifiée dans le DOM

  if (wrapper_notif_length != 0) {
    
    type_message = this.options.type;
    the_class_message = this.options.classmessage;
    the_time = this.options.timerMessage;
    the_message =  this.options.message ;
    wrapper_notif = document.querySelector(this.options.container);
    query_container_placement_attr = wrapper_notif.getAttribute('data-position');
    the_close_btn_opt = this.options.closebtn;
    method_message = this.options.messageMethod;
    html_method = this.options.html;
    btn_callback = this.options.btncallback;


    

    // Gestion du cas ou le data-placement est present sur le container mais qu'il n'est pas renseigné
    if (query_container_placement_attr != null && query_container_placement_attr.length === 0) {
      wrapper_notif.setAttribute('data-position', this.options.containerPos);
      wrapper_notif.setAttribute('data-save-pos', query_container_placement_attr);
    }

    // Gestion du cas ou le data-position n'est pas présent dans le container donné
    else if(query_container_placement_attr === null) {
      wrapper_notif.setAttribute('data-position', this.options.containerPos);
      wrapper_notif.setAttribute('data-save-pos', query_container_placement_attr)
    }
    else {
      wrapper_notif.setAttribute('data-save-pos', query_container_placement_attr)
    }
    
    // Gestion du cas si l'user renseigne la position du container alors
    // cette dernière overwrite la valeur dans le data
    if (this.options.containerPos != query_container_placement_attr) {
      wrapper_notif.setAttribute('data-position', this.options.containerPos);
    }
    console.log('query_container_placement_attr', query_container_placement_attr)
    
    _theMessageTpl();
  }
  else {
    throw new Error('Le script ne peut pas être lancé. La classe ou l\'id est manquante sur le conteneur de notifications')
  }

}
  function _theMessageTpl() {
      // console.log('the message')
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
      // Ici Création de la div de notification
      // Utilisation du fragment pour indiquer au navigateur que c'est un patron de notif
      // pour la performance
        var fragment = document.createDocumentFragment();
        
        the_tpl_message = document.createElement('div');
        the_tpl_message.className = "notify notify-open "+ the_class_type +" "
        the_tpl_message_content = _theMessage();
        _setActions();
        
        
        if (the_close_btn_opt != false ) {
          var the_btn_close = document.createElement('a');
          the_btn_close.className = 'clear-message';
          the_tpl_message.appendChild(the_btn_close);
        }
        fragment.appendChild(the_tpl_message);

        the_tpl_message_arr = new Array();
        the_tpl_message_arr.push(fragment);
      // console.log('tpl-message-arr', the_tpl_message_arr);
      // On init le timer de l'object options.timerMessage
        for (var i = 0; i < the_tpl_message_arr.length; i++) {
          wrapper_notif.appendChild(the_tpl_message_arr[i]);
        }
      // Ici je récuère toutes les notifications générées dans le dom et
      // transformé en Array enfin de passer l'élément
      // Pour l'anim de fin de la notification.
      the_notif = document.querySelectorAll(the_class_message);
      the_notif_arr = Array.prototype.slice.call(the_notif);

      function onUpdate() {
        var test = document.querySelectorAll(the_class_message).length;
        console.log('count notify elm', test);
      }
      
      
      the_notif_arr.forEach(function(element, index) {
        if (the_close_btn_opt != false ) {

        }
        else {
          setTimeout(function(){
            element.className = 'notify '+ the_class_type +' notify-close ';
          }, the_time)
          setTimeout(function(){
            // element.parentNode.removeChild(element);
            get_support_remove(element);
            onUpdate();
            // the_notif_arr.splice(index, 1);
          }, the_time + 500)
        }
          
      })
      console.log('the notif arr', the_notif_arr);
  }
  
  function _theMessage() {
    if (method_message === 'text') {
        the_tpl_message_content = document.createElement('p');
        var cleanText = the_message.replace(/<\/?[^>]+(>|$)/g, "");
        the_tpl_message_content.innerHTML = cleanText;
        the_tpl_message.appendChild(the_tpl_message_content);
    }
    else  {
        console.log('html_method', html_method)
        the_tpl_message.innerHTML = html_method;

      return the_tpl_message;
    }    
  }

  function _setActions() {
    if (btn_callback != false && the_close_btn_opt != false) {
      var the_response;
      
      var the_btn_wrap = document.createElement('div');
      the_btn_wrap.className = 'btn-actions-wrap';
      var the_success_btn = document.createElement('a');
      the_success_btn.className = 'success-notify';
      the_success_btn.innerHTML = 'Valider';

      var the_error_btn = document.createElement('a');
      the_error_btn.className = 'error-notify';
      the_error_btn.innerHTML = 'Annuler';

      the_btn_wrap.appendChild(the_success_btn);
      the_btn_wrap.appendChild(the_error_btn);
      the_tpl_message.appendChild(the_btn_wrap);

      getEvent('click', the_success_btn, function(e){
        // console.log('this succes btn', )
        e.preventDefault();
        var the_act = the_success_btn.parentElement.parentElement;

        the_act.className = "notify notify-close "+ the_class_type +" ";
        setTimeout(function(){
          get_support_remove(the_act);
        }, 500)
        the_response = true;
        return the_response;
        

      })
      getEvent('click', the_error_btn, function(e){
        e.preventDefault();
        var the_act = the_error_btn.parentElement.parentElement;
        the_act.className = "notify notify-close "+ the_class_type +" ";
        setTimeout(function(){
          get_support_remove(the_act);
        }, 500)

        the_response = false;
        return the_response;
      })
    }

    function _act_swipe() {
      var match_media = window.matchMedia("(max-width: 768px)"); 
      if (match_media.matches) {
        get_touch_support(wrapper_notif);
      }
      else {
        console.log('pas de swipe possible');
      }
    }
    _act_swipe();
    getEvent('resize',  window, function() {
      _act_swipe();
    })
    
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

  function getEvent(event, element, func) {
    if (element.addEventListener) {
      element.addEventListener(event, func, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + event, func);
    } else {
      element['on' + event] = func;
    }
  }

// document.addEventListener('touchstart', handleTouchStart, false);        
// document.addEventListener('touchmove', handleTouchMove, false);

function get_touch_support(elm) {

  var touch = elm;
  console.log('touch', touch)

  var xDown = null;                                                        
  var yDown = null; 

  getEvent('touchstart', touch, function(evt){
    xDown = evt.touches[0].clientX;                                      
    yDown = evt.touches[0].clientY;   
  })

  getEvent('touchmove', touch, function(evt){
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        function track_notif_swipe() {
          if (evt.target.parentNode.classList.contains('notify')) {
            evt.target.parentNode.className = "notify notify-close "+ the_class_type +" ";
            setTimeout(function(){
              get_support_remove(evt.target.parentNode);
            },500)
          }
        }

        if ( xDiff > 0 ) {
            /* left swipe */ 
            console.log(evt.target.parentNode);
            track_notif_swipe();
            
            
        } else {
            /* right swipe */
            console.log(evt.target.parentNode);
            track_notif_swipe();
            
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */ 
        } else { 
            /* down swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;   
  })


}

  return Notify;
})
