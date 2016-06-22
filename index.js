var View = require('ampersand-view');
var Dropzone = require('dropzone');
Dropzone.autoDiscover = false;

module.exports = View.extend({
  props:{
    maxFiles:['number',false,1],
    maxFilesize:['number',false,5],
    url:['string',false,'/dropzone/upload'],
    parallelUploads:['number',false,1],
    uploadMultiple:['boolean',false,false],
    addRemoveLinks:['boolean',false,true],
    autoProcessQueue:['boolean',false,true],
    method:['string',false,'POST'],
    hideSaveButton:['boolean',false,false],
    dzEvents:['object',false,function(){
      return {};
    }]
  },
  derived:{
    enableSaveButton:{
      deps:['autoProcessQueue'],
      fn:function(){
        return ! this.autoProcessQueue && ! this.hideSaveButton;
      }
    }
  },
  bindings:{
    enableSaveButton:{
      type:'toggle',
      hook:'save-button'
    }
  },
	template: require('./template.hbs'),
  events:{
    'click button[data-hook=save-button]':'onClickSaveButton'
  },
  onClickSaveButton:function(event){
    event.preventDefault();
    event.stopPropagation();
    if(this.dropzone.files.length>0){
      this.dropzone.processQueue();
    } else {
    }
  },
  render:function(){
    this.renderWithTemplate(this);

    var container = this.queryByHook('dropzone');
    // when Dropzone is instantiated dz autorender itself into the container element
    this.dropzone = new Dropzone(container,this._values);

    var self = this;
    for(var eventName in this.dzEvents){
      var dzEventHandler = this.dzEvents[eventName];
      this.dropzone.on(eventName,function(){
        dzEventHandler.apply(self,arguments);
      });
    }
  },
  save:function(){
    if(this.dropzone.files.length==0)
      if(this.dzEvents.complete)
        this.dzEvents.complete.call(self,{});

    else this.dropzone.processQueue();
  },
  onSuccess:function(){
    console.log('dropzone success event ',arguments);
  },
  onError:function(){
    console.log('dropzone error event ',arguments);
  },
  onComplete:function(){
    console.log('dropzone complete event ',arguments);
  }
});
