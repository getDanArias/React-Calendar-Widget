import React, {Component} from 'react';

import DateHelper from '../utils/DateHelper';

import './Calendar.css';

class DisplayDay extends Component {
	constructor(props) {
		super(props);
		
		this.changeDay = this.changeDay.bind(this);
		
		this.state = {
			highlighted: false
		}
	}
	
	changeDay() {
		this.props.highlight(this.props.dayInfo);
		this.setState(
			{
				highlighted: true
			}
		)
	}
	
	render() {
		
		let display = () => {
			if (this.props.notCurrent) {
				return (
					<div className="DisplayDay NotCurrent" onClick={this.props.nav}>
						{this.props.dayInfo.getDate()}
					</div>
				)
			} else {
				return (
					<div className={`DisplayDay ${this.props.currentDay === this.props.dayInfo? `Highlighted` : null}`} onClick={this.changeDay}>
						{this.props.dayInfo.getDate()}
					</div>
				)
			}
		};
		
		return (
			display()
		)
	}
}

class DisplayMonth extends Component {
	render() {
		return (
			<div className="DisplayMonth">
				<div className="DisplayMonthMonths">
					<div>
						{
							this.props.currentMonthInfo.prevMonthDate !== null ?
							<span onClick={this.props.prevMonth}>
								{
									DateHelper.getMonthName(this.props.currentMonthInfo.prevMonthDate.getMonth())
								}
							</span> :
							null
						}
					</div>
					<div>
						{
							this.props.currentMonthInfo.prevMonthDate !== null ?
								`${DateHelper.getMonthName(this.props.currentMonthInfo.firstDay.getMonth())} ${this.props.currentMonthInfo.firstDay.getFullYear()}` :
							null
						}
					</div>
					<div>
						{
							this.props.currentMonthInfo.prevMonthDate !== null ?
							<span onClick={this.props.nextMonth}>
								{
									DateHelper.getMonthName(this.props.currentMonthInfo.nextMonthDate.getMonth())
								}
							</span> :
							null
						}
					</div>
				</div>
				<div className="DisplayMonthDaysNames">
					<div className="DisplayMonthDaysNamesWrapper">
						{
							DateHelper.getDaysOfWeekShort().map((day, key) =>
								<div className={`weekDay ${this.props.currentDay !== null && this.props.currentDay.getDay() === key ? `currentWeekDay`: null}`} key={key}>
									{day}
								</div>)
						}
					</div>
				</div>
				<div className="DisplayMonthDays">
					{
						this.props.currentMonthInfo.tail.map((day, key) =>
							<DisplayDay key={key} dayInfo={day} notCurrent={true} nav={this.props.prevMonth}/>)
					}
					{
						this.props.currentMonthInfo.days.map((day, key) =>
							<DisplayDay key={key}
							            dayInfo={day}
							            notCurrent={false}
							            currentDay={this.props.currentDay}
							            highlight={this.props.changeDay}/>)
					}
					{
						this.props.currentMonthInfo.head.map((day, key) =>
							<DisplayDay key={key} dayInfo={day} notCurrent={true} nav={this.props.nextMonth}/>)
					}
				</div>
			</div>
		)
	}
}

export default class Calendar extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			currentMonth: {
				days: [],
				firstDay: null,
				lastDay: null,
				prevMonthDate: null,
				nextMonthDate: null,
				tail: [],
				head: []
			},
			currentDay: null
		};
		
		this.getMonth = this.getMonth.bind(this);
		this.populateHeadTail = this.populateHeadTail.bind(this);
		this.prevMonth = this.prevMonth.bind(this);
		this.nextMonth = this.nextMonth.bind(this);
		this.changeMonth = this.changeMonth.bind(this);
		this.changeDay = this.changeDay.bind(this);
	}
	
	getMonth(date) {
		
		let days = [];
		
		let today = new Date(date);
		today.day = today.getDate();
		
		days.push(today);
		
		let yesterday = new Date(today);
		yesterday.day = 0;
		
		let tomorrow = new Date(today);
		tomorrow.day = 0;
		
		while (yesterday.day !== 1 && (today.day !== 1)) {
			yesterday = new Date(yesterday);
			yesterday.setDate(yesterday.getDate() - 1);
			yesterday.day = yesterday.getDate();
			
			days.unshift(yesterday);
		}
		
		if (today.getMonth() !== 1) {
			while (tomorrow.day !== 30 && (today.day !== 30 && today.day !== 31)) {
				tomorrow = new Date(tomorrow);
				tomorrow.setDate(tomorrow.getDate() + 1);
				tomorrow.day = tomorrow.getDate();
				
				days.push(tomorrow);
				
				if (tomorrow.day === 30) {
					let afterTomorrow = new Date(tomorrow);
					afterTomorrow.setDate(afterTomorrow.getDate() + 1);
					afterTomorrow.day = afterTomorrow.getDate();
					
					if (afterTomorrow.day === 31) {
						days.push(afterTomorrow);
					}
					
				}
			}
		} else {
			while (tomorrow.day !== 28 && (today.day !== 28 && today.day !== 29)) {
				tomorrow = new Date(tomorrow);
				tomorrow.setDate(tomorrow.getDate() + 1);
				tomorrow.day = tomorrow.getDate();
				
				days.push(tomorrow);
				
				if (tomorrow.day === 28) {
					let afterTomorrow = new Date(tomorrow);
					afterTomorrow.setDate(afterTomorrow.getDate() + 1);
					afterTomorrow.day = afterTomorrow.getDate();
					
					if (afterTomorrow.day === 29) {
						days.push(afterTomorrow);
					}
					
				}
			}
		}
		
		let firstDay = days[0];
		let lastDay = days[days.length - 1];
		
		let prevMonthDate = new Date(firstDay);
		let nextMonthDate = new Date(lastDay);
		
		prevMonthDate.setDate(prevMonthDate.getDate() - 1);
		nextMonthDate.setDate(nextMonthDate.getDate() + 1);

		return {
			days,
			firstDay,
			lastDay,
			prevMonthDate,
			nextMonthDate,
			tail: [],
			head: []
		};
	}
	
	populateHeadTail(currentMonth) {
		let prevMonth = this.getMonth(currentMonth.prevMonthDate);
		let nextMonth = this.getMonth(currentMonth.nextMonthDate);
		
		if (currentMonth.firstDay.getDay() !== 0) {
			
			let upperBound = currentMonth.firstDay.getDay();
			
			for (let i = 0; i < upperBound; i++) {
				currentMonth.tail.unshift(prevMonth.days[prevMonth.days.length - 1 - i]);
			}
		} else {
			for (let i = 0; i < 7; i++) {
				currentMonth.tail.unshift(prevMonth.days[prevMonth.days.length - 1 - i]);
			}
		}
		
		let nextWalker = 0;
		
		if (currentMonth.lastDay.getDay() !== 6) {
			let lowerBound = currentMonth.lastDay.getDay();
			
			for (let j = lowerBound; j < 6; nextWalker++, j++) {
				currentMonth.head.push(nextMonth.days[nextWalker]);
			}
			
		} else {
			for (let nextWalker = 0; nextWalker < 7; nextWalker++) {
				currentMonth.head.push(nextMonth.days[nextWalker]);
			}
		}
		
		let combinedLength = currentMonth.days.length + currentMonth.head.length + currentMonth.tail.length;
		
		if (combinedLength <= 35) {
			for (let i = 0; i < 7; i++, nextWalker++) {
				currentMonth.head.push(nextMonth.days[nextWalker]);
			}
		}
		
	}
	
	prevMonth() {
		this.changeMonth(this.state.currentMonth.prevMonthDate);
	}
	
	nextMonth() {
		this.changeMonth(this.state.currentMonth.nextMonthDate);
	}
	
	changeMonth(newDate) {
		let currentMonth = this.getMonth(newDate);
		this.populateHeadTail(currentMonth);
		
		this.setState({
			currentMonth: Object.assign({}, currentMonth),
			currentDay: null
		});
	}
	
	changeDay(date) {
		this.setState({
			currentDay: date
		});
	}
	
	componentWillMount() {
		let currentMonth = this.getMonth(new Date());
		
		this.populateHeadTail(currentMonth);
		
		this.setState({
			currentMonth: Object.assign({}, currentMonth)
		});
		
	}
	
	render() {
		
		return (
			<div className="Calendar">
				<DisplayMonth
					currentMonthInfo={this.state.currentMonth}
					currentDay={this.state.currentDay}
					changeDay={this.changeDay}
					prevMonth={this.prevMonth}
					nextMonth={this.nextMonth}/>
			</div>
		)
	}
}