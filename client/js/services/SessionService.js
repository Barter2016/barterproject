'use strict';

angular.module('BarterApp').service('SessionService', function() {

   var self = this;

   //*************************************************************************
   // Creates a session that contains the user credentials and the users' key.
   // Input : The users' credentials, the users' key
   //*************************************************************************
   self.create = function(user_credentials, user_key) {
      self.set(user_credentials, user_key);
   };

   //******************************
   // Destroys the current session.
   //******************************
   self.destroy = function() {
      self.set(null, null);
   };

   //**************************************************
   // Sets the sessions' info.
   // Input : The users' credentials and the users' key
   //**************************************************
   self.set = function(user_credentials, user_key) {
      self.user_credentials = user_credentials;
      self.user_key = user_key;
   };

   //************************************************************************
   // Gets the sessions' info.
   // Output : An object containing the users' credentials and the users' key
   //************************************************************************
   self.get = function() {
      return {
         user_credentials: self.user_credentials,
         user_key: self.user_key
      };
   };

   //*****************************************
   // Checks if the session is alive.
   // Output : True if it is, false otherwise
   //*****************************************
   self.isAlive = function() {
      return (self.get().user_credentials && self.get().user_key);
   };

});