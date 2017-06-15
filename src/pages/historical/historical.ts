import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth-service';
import { IMyDpOptions } from 'mydatepicker';
import { IMyDrpOptions } from 'mydaterangepicker';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'page-historical',
  templateUrl: 'historical.html',
})
export class HistoricalPage{
	@ViewChild(BaseChartDirective) chart: BaseChartDirective;
	@ViewChild('baseChart') Chart;
	private datePickerOptions;
	private dateRangePickerOptions;
	calendar = "singleDate";
  	userDate;
  	userDateRange;
  	dataType;
  	date: Date;
  	disabledDay;
  	type;
  	dailyItems: FirebaseListObservable<any[]>;
  	isDataAvailable = false;
  	isDataRangeAvailable = false;
  	isDataRangeByTypeAvailable = false;
  	isSingleDateDataAvailable = false;
  	isHgrDataAvailable = false;
  	areStepsDataAvailable = false;
  	isDistanceDataAvailable = false;
  	isCaloriesDataAvailable = false;
  	isDreamDataAvailable = false;
  	icons: string[];
  	units: string[];
  	dailyData;
  	samplesHgr;
  	samplesDream;
  	samplesCalories;
  	samplesSteps;
  	samplesDistance;
  	rangeOfDays;
  	rangeOfHours;
  	rangeOfMinutes;
  	item;
  	days;
  	dataTypeIcon;
  	dataTypeUnit;
  	userHour;
  	previousHour;
  	userHourRange;
  	selectedDate="";
  	selectedDateRange="";
  	placeholderTxt = "dd-mm-yyyy"
  	private datePickerForm: FormGroup;
  	private dateRangePickerForm: FormGroup;
  	chartLegend:boolean = false;
  	rangeChartData;
	rangeChartLabels;
	dreamChartData;
	caloriesChartData;
	distanceChartData;
	stepsChartData;
	chartColors:Array<any> = [
		{ 
			backgroundColor: 'rgba(248,177,54,0.8)',
			borderColor: 'rgba(248,177,54,0.8)',
			pointBackgroundColor: 'rgba(248,177,54,0.8)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(248,177,54,0.8)'
		}
	];
	hgrChartData;
	hgrChartLabels;
	chartType:string = 'bar';
	chartOptions:any = {
		responsive: true,
		scales: {
			yAxes: [{
				ticks: {
				  suggestedMin: 50
				},
				gridLines: {
				  display:false
				}
			}],
			xAxes: [{
				display: true
			}]
		}
	};
	constructor(public af: AngularFireDatabase,private formBuilder: FormBuilder, private _auth: AuthService, public navCtrl: NavController, public navParams: NavParams) {
		this.date = new Date(Date.now());
		this.icons = ['flame','map','walk','moon'];
      	this.units = ['kcal','km','','h']
      	let tomorrow = new Date();
      	let today = new Date();
	    tomorrow.setDate(this.date.getDate()+1);
	    this.disabledDay = {year: tomorrow.getFullYear().toString(),
	    	month: (tomorrow.getMonth()+1).toString(), 
	    	day: tomorrow.getDate().toString() };
	    this.previousHour = this.addZero((this.date.getHours() -1 )).toString() + ":" + this.addZero(this.date.getMinutes().toString());
	    this.datePickerOptions = {
	    	dayLabels: {su: "Do", mo: "Lu", tu: "Ma", we: "Mi", th: "Ju", fr: "Vi", sa: "Sa"},
            monthLabels: {1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic"},
            firstDayOfWeek: "mo",
	    	dateFormat: 'dd-mm-yyyy',
	    	allowDeselectDate: true,
	    	showTodayBtn: false,
	    	showSelectDateText: true,
	    	sunHighlight: false,
	    	selectBeginDateTxt: true,
	    	selectEndDateTxt: true,
	    	editableDateField: false,
	    	showSelectorArrow: true,
	    	inline:false,
	    	markCurrentDay: true,
	    	showClearDateBtn: true,
	    	minYear: 2016,
	    	disableSince: this.disabledDay
 		};
 		this.dateRangePickerOptions = {
	    	dayLabels: {su: "Do", mo: "Lu", tu: "Ma", we: "Mi", th: "Ju", fr: "Vi", sa: "Sa"},
            monthLabels: {1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic"},
            firstDayOfWeek: "mo",
	    	dateFormat: 'dd-mm-yyyy',
	    	showSelectDateText : true,
	    	selectBeginDateTxt: "Selecciona una fecha inicial",
	    	selectEndDateTxt: "Selecciona una fecha final",
	    	showSelectorArrow: true,
	    	monthSelector: true,
	    	yearSelector: true,
	    	disableHeaderButtons: false,
	    	inline: false,
	    	showClearDateRangeBtn: false,
	    	editableDateRangeField: false,
	    	sunHighlight: false,
	    	markCurrentDay: true,
	    	disableSince: this.disabledDay
 		};
		this.datePickerForm = this.formBuilder.group({
	    	userDate: [null, Validators.required],
	    	userHour: [this.previousHour, Validators.pattern('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$')],
			userHourRange:['', Validators.pattern('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$')],
			dataType: ['', Validators.required]
		});
		this.dateRangePickerForm = this.formBuilder.group({
	    	userDateRange: ['', Validators.required],
	    	dataType: ['', Validators.required]
		});
	
	}
	
	setDate(): void {
	    let date = new Date();
	    this.datePickerForm.setValue({userDate: {
	    date: {
	        year: date.getFullYear(),
	        month: date.getMonth() + 1,
	        day: date.getDate()}
	    }});
	}
	setDateRange(): void {
	    let date = new Date();
	    let year = date.getFullYear();
	    let month = date.getMonth() + 1;
	    let day = date.getDate();
	    this.datePickerForm.setValue({userDateRange: {
	    	beginDate: {year: year, month: month, day: day},
	    	endDate: {year: year, month: month, day: day}}});
	}

	clearDate(): void {
	    this.datePickerForm.setValue({userDate: null});
	}
	clearDateRange(): void {
	    this.dateRangePickerForm.setValue({userDateRange: null});
	}

	onSubmit() {
		this.isSingleDateDataAvailable = false;
		this.isDataRangeByTypeAvailable = false;
	    this.isDataAvailable = false;
	    this.isDataRangeAvailable = false;
	    this.isHgrDataAvailable = false;
	    this.areStepsDataAvailable = false;
  		this.isDistanceDataAvailable = false;
  		this.isCaloriesDataAvailable = false;
  		this.isDreamDataAvailable = false;
	    if (this.datePickerForm.valid) {
	    	if (this.datePickerForm.controls.dataType.value=="todos") {
	    		this.dailyItems = this.af.list('/daily/' +
	    		this.datePickerForm.controls.userDate.value.formatted 
	    			+ '/' + this._auth.displayNick());
		    	this.isSingleDateDataAvailable = true;
		    	this.selectedDate = this.datePickerForm.controls.userDate.value.formatted;
	    	}else{
				this.hgrChartLabels = [];
				this.samplesHgr = [];
				let hours;
				if (this.datePickerForm.controls.userHourRange.value) {
					hours = this.getRangeOfHours(this.datePickerForm.controls.userHour.value,
						this.datePickerForm.controls.userHourRange.value);
				}else{
					hours = this.getRangeOfMinutes(this.datePickerForm.controls.userHour.value);
				}
				this.hgrChartLabels = hours;
	    		if (this.datePickerForm.controls.dataType.value=="glucose") {
	    			this.dataTypeIcon = "medkit";
		    		this.type = "Glucosa"
					for (var hour of hours) {
						this.item = this.af.object('/glucose/'+this._auth.displayNick() + '/'+
							this.datePickerForm.controls.userDate.value.formatted + '/' + hour+ '/', 
							{ preserveSnapshot: true });
						this.item.subscribe(snapshot => {
							this.samplesHgr.push(snapshot.val());
							this.updateHoursChart(this.samplesHgr.length, hours.length);
						});
					}
	    		}
		    	if (this.datePickerForm.controls.dataType.value=="heart-rate") {
		    		this.dataTypeIcon = "heart";
		    		this.type = "Pulsaciones"
					for (var hour of hours) {
						this.item = this.af.object('/heart-rate/'+this._auth.displayNick() + '/'+
							this.datePickerForm.controls.userDate.value.formatted + '/' + hour+ '/', 
							{ preserveSnapshot: true });
						this.item.subscribe(snapshot => {
							this.samplesHgr.push(snapshot.val());
							this.updateHoursChart(this.samplesHgr.length, hours.length);
						});
					}
		    	}

	    	}
	    	
	    }
	    this.datePickerForm.reset();
  	}
  	onSubmitRange() { 
	    if (this.dateRangePickerForm.valid) {
	    	this.rangeChartLabels = [];
	    	this.isSingleDateDataAvailable = false;
			this.isDataRangeByTypeAvailable = false;
		    this.isDataAvailable = false;
		    this.isDataRangeAvailable = false;
		    this.isHgrDataAvailable = false;
		    this.areStepsDataAvailable = false;
	  		this.isDistanceDataAvailable = false;
	  		this.isCaloriesDataAvailable = false;
	  		this.isDreamDataAvailable = false;
	    	this.rangeChartData = [];
	    	this.selectedDateRange = this.dateRangePickerForm.controls.userDateRange.value.formatted;
    		let days = this.getRangeOfDates(
	    		this.dateRangePickerForm.controls.userDateRange.value.beginEpoc, 
	    		this.dateRangePickerForm.controls.userDateRange.value.endEpoc);
    		this.rangeChartLabels = this.rangeOfDays;
	    	if (this.dateRangePickerForm.controls.dataType.value=="todos") {
	    		this.samplesDream = [];
			  	this.samplesCalories = [];
			  	this.samplesSteps = [];
			  	this.samplesDistance = [];
				let dream, steps, calories, distance;
	    		for (var day of days) {
	    			calories = this.af.object('/daily/'+day+'/'+this._auth.displayNick() + 
						'/calorías/', 
						{ preserveSnapshot: true });
					calories.subscribe(snapshot => {
						this.samplesCalories.push(snapshot.val());
						this.updateDaysChart(this.samplesCalories.length, "calorías", days.length);
					});
					distance = this.af.object('/daily/'+day+'/'+this._auth.displayNick() + 
						'/distancia/', 
						{ preserveSnapshot: true });
					distance.subscribe(snapshot => {
						this.samplesDistance.push(snapshot.val());
						this.updateDaysChart(this.samplesDistance.length, "distancia", days.length);
					});
					steps = this.af.object('/daily/'+day+'/'+this._auth.displayNick() + 
						'/pasos/', 
						{ preserveSnapshot: true });
					steps.subscribe(snapshot => {
						this.samplesSteps.push(snapshot.val());
						this.updateDaysChart(this.samplesSteps.length, "pasos", days.length);
					});
					dream = this.af.object('/daily/'+day+'/'+this._auth.displayNick() + 
						'/sueño/', 
						{ preserveSnapshot: true });
					dream.subscribe(snapshot => {
						this.samplesDream.push(snapshot.val());
						this.updateDaysChart(this.samplesDream.length, "sueño", days.length);
					});
				}
	    	}else{
	    		this.dailyData = [];
	    		this.type = this.dateRangePickerForm.controls.dataType.value;
	    		switch (this.type) {
	    			case "pasos":
	    				this.dataTypeIcon = "walk";
	    				this.dataTypeUnit = "";
	    				break;
	    			case "distancia":
	    				this.dataTypeIcon = "map";
	    				this.dataTypeUnit = "km";
	    				break;
	    			case "calorías":
	    				this.dataTypeIcon = "flame";
	    				this.dataTypeUnit = "kcal";
	    				break;
	    			case "sueño":
	    				this.dataTypeIcon = "moon";
	    				this.dataTypeUnit = "h";
	    				break;
	    			default:
	    				this.dataTypeIcon = "";
	    				this.dataTypeUnit = "";
	    				break;
	    		}
	    		for (var day of days) {
					this.item = this.af.object('/daily/'+day+'/'+this._auth.displayNick() + 
						'/' + this.dateRangePickerForm.controls.dataType.value + '/', 
						{ preserveSnapshot: true });
					this.item.subscribe(snapshot => {
						this.dailyData.push(snapshot.val());
						this.updateDaysChart(this.dailyData.length, "general", days.length);
					});
				}
		    }

	    }
	    this.dateRangePickerForm.reset();
  	}
  	updateDaysChart(dailyDataLength, type, timeLength): any{
  		switch (type) {
  			case "pasos":
  				if (dailyDataLength==timeLength) {
		  			this.stepsChartData = [{data : this.samplesSteps}];
					this.areStepsDataAvailable = true;
				}
  				break;
  			case "distancia":
  				if (dailyDataLength==timeLength) {
		  			this.distanceChartData = [{data : this.samplesDistance}];
					this.isDistanceDataAvailable = true;
				}
  				break;
  			case "calorías":
  				if (dailyDataLength==timeLength) {
		  			this.caloriesChartData = [{data : this.samplesCalories}];
					this.isCaloriesDataAvailable = true;
				}
  				break;
  			case "sueño":
  				if (dailyDataLength==timeLength) {
		  			this.dreamChartData = [{data : this.samplesDream}];
					this.isDreamDataAvailable = true;
				}
  				break;
  			default:
  				if (dailyDataLength==timeLength) {
		  			this.rangeChartData = [{data : this.dailyData}];
					this.isDataRangeByTypeAvailable = true;
				}
  				break;
  		}
  		setTimeout(() => {
            if (this.chart && this.chart.chart && this.chart.chart.config) {
                this.chart.chart.config.data.labels = this.rangeOfDays;
                this.chart.chart.update();
            }
        });
  		
  	}
  	updateHoursChart(samplesHgrLength, timeLength): any{
  		if (samplesHgrLength==timeLength) {
  			this.hgrChartData = [{data : this.samplesHgr}];
			this.isHgrDataAvailable = true;
		}
  	}
  	addZero(number): any {
		return number<10? '0'+number:''+number;
	}
	getRangeOfDates(initialDate,endDate): any{
		this.rangeOfDays = [];
		let init = new Date(initialDate*1000);
		let end = new Date(endDate*1000);
		do {
			this.rangeOfDays.push(this.addZero(init.getDate()) + "-" + this.addZero((init.getMonth()+1)) + "-" + init.getFullYear());
			init = new Date(init.getTime() + (24*60*60*1000));
		} while (init.getTime() != end.getTime()+ (24*60*60*1000));
		return this.rangeOfDays;
	}
	getRangeOfMinutes(hourGiven): any{
		this.rangeOfMinutes = [];
		let hour = hourGiven.slice(0,hourGiven.indexOf(":"));
		for (var i = 0; i < 60; i++) {
        	this.rangeOfMinutes.push(hour+":"+this.addZero(i));
      	}
      	return this.rangeOfMinutes;
	}
	getRangeOfHours(init, end): any{
		this.rangeOfHours = [];
		let initHour = init.slice(0,init.indexOf(":"));
		let initMinute = init.slice(init.indexOf(":")+1);
		let endHour = end.slice(0,end.indexOf(":"));
		let endMinute = end.slice(end.indexOf(":")+1);
		let initTime, endTime, minute, hour;
		if (initHour > endHour) {
			console.log("Hour range is wrong init > end. Hour range inverted");
			initTime = Number(endHour)*60 + Number(endMinute);
			endTime = Number(initHour)*60 + Number(initMinute);
			minute = Number(endMinute);
			hour = Number(endHour);
		}else{
			initTime = Number(initHour)*60 + Number(initMinute);
			endTime = Number(endHour)*60 + Number(endMinute);
			minute = Number(initMinute);
			hour = Number(initHour);
		}
		for (var i = 0; i < endTime-initTime; i++) {
			this.rangeOfHours.push(this.addZero(hour)+":"+this.addZero(minute));
			if (minute==59) {
				hour++;
				minute = 0;
			}else{
				minute++;
			}
      	}
      	return this.rangeOfHours;
	}
    resetDateRange(): void {
        let date: Date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        this.datePickerForm.setValue({userDateRange: {
	    	beginDate: {year: year, month: month, day: day},
	    	endDate: {year: year, month: month, day: day}}});
    }
	ionViewDidLoad() {
		console.log('ionViewDidLoad Historical');
	}
}
