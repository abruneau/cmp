'use strict';

var jsforce = require('jsforce');

/**
 * @ngdoc service
 * @name cmpApp.salesForce
 * @description
 * # salesForce
 * Service in the cmpApp.
 */
angular.module('cmpApp').factory('salesForce', function (database, Accounts) {
	var self = this;

	var connection;
	var connected = false;
	var observerCallbacks = [];
	var accountOptions = [];

	var accountFields = ['Id', 'IsDeleted', 'MasterRecordId', 'Name', 'Type', 'RecordTypeId', 'ParentId', 'BillingStreet', 'BillingCity', 'BillingState', 'BillingPostalCode', 'BillingCountry', 'BillingLatitude', 'BillingLongitude', 'BillingGeocodeAccuracy', 'BillingAddress', 'ShippingStreet', 'ShippingCity', 'ShippingState', 'ShippingPostalCode', 'ShippingCountry', 'ShippingLatitude', 'ShippingLongitude', 'ShippingGeocodeAccuracy', 'ShippingAddress', 'Phone', 'Fax', 'Website', 'PhotoUrl', 'Sic', 'Industry', 'AnnualRevenue', 'NumberOfEmployees', 'Ownership', 'TickerSymbol', 'Description', 'Site', 'CurrencyIsoCode', 'OwnerId', 'CreatedDate', 'CreatedById', 'LastModifiedDate', 'LastModifiedById', 'SystemModstamp', 'LastActivityDate', 'LastViewedDate', 'LastReferencedDate', 'IsPartner', 'IsCustomerPortal', 'JigsawCompanyId', 'CleanStatus', 'AccountSource', 'DunsNumber', 'Tradestyle', 'NaicsCode', 'NaicsDesc', 'YearStarted', 'SicDesc'];
	var opportunityFields = ['Id', 'IsDeleted', 'AccountId', 'RecordTypeId', 'Name', 'Description', 'StageName', 'Amount', 'CloseDate', 'Type', 'LeadSource', 'IsClosed', 'IsWon', 'ForecastCategory', 'ForecastCategoryName', 'CurrencyIsoCode', 'CampaignId', 'HasOpportunityLineItem', 'IsSplit', 'OwnerId', 'CreatedDate', 'CreatedById', 'LastModifiedDate', 'LastModifiedById', 'SystemModstamp', 'LastActivityDate', 'FiscalQuarter', 'FiscalYear', 'Fiscal', 'LastViewedDate', 'LastReferencedDate', 'SyncedQuoteId', 'HasOpenActivity', 'HasOverdueTask', 'Sugar_Account_ID__c', 'Sugar_Contact_ID__c', 'previous_modified_user_id__c', 'previous_created_by__c', 'previous_assigned_user_id__c', 'Sugar_opportunity_id__c', 'Contract_Start_Date__c', 'Hardware_Resold__c', 'Storage_Resold__c', 'Contract_Term__c', 'Partner_Connections__c', 'Service_Revenue__c', 'Bundles_Revenue__c', 'Create_Future_Opportunity__c', 'Originating_Opportunity__c', 'Currently_Using_Hadoop__c', 'Data_Traffic_per_Day__c', 'Where_Hadoop__c', 'Analytics_Apps_Resold__c', 'Lead_Type__c', 'Subscription__c', 'Sent_To_Jira__c', 'Opportunity_Type__c', 'RSD_Total_Quota__c', 'Hadoop_Components_in_Use__c', 'BI_Resold__c', 'Partner_Sourced__c', 'Data_Warehouse_Resold__c', 'Order_Number__c', 'ETL_Resold__c', 'Renewal_Date_del__c', 'Days_to_Renewal__c', 'Opportunity_City__c', 'Opportunity_State__c', 'Opportunity_Country__c', 'Sales_Engineer__c', 'Support_Input__c', 'Networking_Resold__c', 'Reseller_Temp__c', 'Related_Technologies__c', 'Technologies_In_Use_Servers__c', 'Technologies_in_Use_Networking__c', 'Technologies_In_Use_OS__c', 'Technologies_In_Use_Data_Warehouse__c', 'Technologies_In_Use_BI__c', 'Technologies_In_Use_ETL__c', 'Technologies_In_Use_Analytics_Apps__c', 'OS_Resold__c', 'Other_Resold__c', 'Technologies_In_Use_Filled__c', 'Deal_Registration__c', 'Technologies_in_Use_Other__c', 'Deal_Registration_Date__c', 'Stage_Changed_Date__c', 'Competitor__c', 'Reason_Won_Lost__c', 'Services_Needed__c', 'Services_Stage__c', 'LID__LinkedIn_Company_Id__c', 'RSD_Name__c', 'Trial_Approved_By__c', 'Metric__c', 'Economic_Buyer__c', 'Decision_Criteria__c', 'Decision_Process__c'];

	function Sf() {
		this.setting = 'sf';
		this.loginUrl = '';
		this.email = '';
		this.password = '';
		this.token = '';
	}

	function Identity() {
		this.setting = 'identity';
	}

	var identity = new Identity();
	var settings = new Sf();

	//call this when you know 'foo' has been changed
	var notifyObservers = function () {
		angular.forEach(observerCallbacks, function (callback) {
			callback();
		});
	};

	function settingsAreComplit() {
		if (self.setting._id && self.setting.loginUrl && self.setting.email && self.setting.password && self.setting.token) {
			return true;
		} else {
			return false;
		}
	}

	var connect = function () {
		if (settingsAreComplit) {
			connection = new jsforce.Connection({
				loginUrl: self.settings.loginUrl
			});

			connection.login(self.settings.email, self.settings.password.concat(self.settings.token), function (err) {
				if (err) {
					console.log(err);
				} else {
					self.connected = true;
					notifyObservers();
				}

			});
		}
	};

	var updateIndentity = function () {
		console.log(" Connected " + connected);
		if (self.connected) {
			connection.identity(function (err, res) {
				if (err) {
					return console.error(err);
				}

				res._id = self.identity._id;
				res.setting = self.identity.setting;
				database.update({
					_id: self.identity._id
				}, res, {}, function (err) {
					if (!err) {
						self.identity = res;
						notifyObservers();
					} else {
						console.log(err);
					}
				});
			});
		}
	};

	function getSettings() {
		database.findOne({
			setting: 'sf'
		}, function (err, doc) {
			if (doc) {
				self.settings = doc;
				connect();
				notifyObservers();
			} else if (err) {
				console.log(err);
			} else {
				database.insert(settings, function (err, newDoc) { // Callback is optional
					if (!err && newDoc) {
						self.settings = newDoc;
						notifyObservers();
					} else {
						console.log(err);
					}
				});
			}
		});
	}

	var getDesc = function () {
		connection.describe('Opportunity')
			.then(function (res) {
				var names = res.fields;
				var fs = require('fs');
				var util = require('util');
				fs.writeFileSync('./Oppotunity.json', util.inspect(names), 'utf-8');
				//console.log(res);
			}, function (err) {
				console.log(err);
			});
	};

	function getIdentity() {
		database.findOne({
			setting: 'identity'
		}, function (err, doc) {
			if (doc) {
				self.identity = doc;
				notifyObservers();
			} else if (err) {
				console.log(err);
			} else {
				database.insert(identity, function (err, newDoc) { // Callback is optional
					if (!err && newDoc) {
						self.identity = newDoc;
						notifyObservers();
					} else {
						console.log(err);
					}
				});
			}
		});
	}

	var update = function (set) {
		database.update({
			_id: set._id
		}, set, {}, function (err) {
			if (!err) {
				self.settings = set;
				connect();
				notifyObservers();
			} else {
				console.log(err);
			}
		});
	};

	var findAccountByName = function (name) {
		connection.query("SELECT Id, Name, Description FROM Account WHERE Name LIKE '%" + name + "%' LIMIT 10")
			.then(function (res) {
				self.accountOptions = res.records;
				notifyObservers();
				//console.log(res);
			}, function (err) {
				console.log(err);
			});
	};

	var loadOpportunities = function (id) {
		connection.query("SELECT " + opportunityFields.toString() + ", (SELECT Name, TeamMemberRole FROM OpportunityTeamMembers) FROM Opportunity WHERE AccountId = '" + id + "'")
			.then(function (res) {
				database.remove({
					AccountId: id
				}, {
					multi: true
				}, function (err) {
					if (err) {
						console.log(err);
					}else {
						database.insert(res.records, function (err) {
							if (err) {
								console.log(err);
							}
							Accounts.getOpportunities(id);
						});
					}
				});
			}, function (err) {
				console.log(err);
			});
	};

	var loadAccount = function (id) {
		connection.query("SELECT " + accountFields.toString() + " FROM Account WHERE Id = '" + id + "'")
			.then(function (res) {
				database.update({
					$and: [{
						"attributes.type": 'Account'
					}, {
						"Id": id
					}]
				}, res.records[0], {
					upsert: true
				}, function (err) { // Callback is optional
					if (err) {
						console.log(err);
					} else {
						Accounts.updateList();
					}
				});
				loadOpportunities(id);
				//console.log(res);
			}, function (err) {
				console.log(err);
			});
	};

	getSettings();
	getIdentity();

	//register an observer
	self.registerObserverCallback = function (callback) {
		observerCallbacks.push(callback);
	};
	self.settings = settings;
	self.identity = identity;
	self.update = update;
	self.connected = connected;
	self.updateIndentity = updateIndentity;
	self.findAccountByName = findAccountByName;
	self.accountOptions = accountOptions;
	self.loadAccount = loadAccount;
	self.loadOpportunities = loadOpportunities;
	self.getDesc = getDesc;

	return self;
});
