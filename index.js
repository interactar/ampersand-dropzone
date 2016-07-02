var View = require('ampersand-view');
var Dropzone = require('dropzone');
Dropzone.autoDiscover = false;
var debug = require('debug')('dropzone');

module.exports = View.extend({
  props:{
    maxFiles:['number',false,1],
    maxFilesize:['number',false,5],
    parallelUploads:['number',false,1],
    uploadMultiple:['boolean',false,false],
    addRemoveLinks:['boolean',false,true],
    autoProcessQueue:['boolean',false,true],
    method:['string',false,'POST'],
    hideSaveButton:['boolean',false,false],
    fileTypes:['array',false,function(){ return[]; }],
    url:['any',false,function(){
      debug('url not set yet. remember to use a funtion!');
      return '';
    }],
    dzEvents:['object',false,function(){ return {}; }],
  },
  derived:{
    enableSaveButton:{
      deps:['autoProcessQueue'],
      fn:function(){
        return ! this.autoProcessQueue && ! this.hideSaveButton;
      }
    },
    acceptedFiles:{
      deps:['fileTypes'],
      fn:function(){
        return fileTypes.join(',');
      }
    },
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
    if(this.dropzone && this.dropzone.files.length>0){
      this.dropzone.processQueue();
    } else {
      debug('no file selected. button should be disabled');
    }
  },
  render:function(){
    var self = this;
    this.renderWithTemplate(this);

    // when Dropzone is instantiated dz autorender itself into the container element
    var container = this.queryByHook('dropzone');
    var dropzone = new Dropzone(container,this._values);
    this.dropzone = dropzone;

    this.listenTo(this,'change',this.updateDropzone);
    this.setDzEvents(this.dzEvents);
  },
  updateDropzone:function(){
    this.setDzEvents(this.dzEvents);
  },
  setDzEvents:function(dzEvents){
    for(var eventName in dzEvents){
      this.dropzone.on(eventName,function(){
        console.log('handling dropzone event ', eventName);
        dzEvents[eventName](arguments);
      });
    }
  },
  save:function(options){
    options||(options={});
    if(options.dzEvents){
      this.setDzEvents(options.dzEvents);
    }

    if(this.dropzone.files.length==0){
      if(this.dzEvents.complete){
        this.dzEvents.complete({});
      }
    } else {
      this.dropzone.processQueue();
    }
  }
});
