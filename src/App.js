import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const headers = new Headers()
// headers.append("Access-Control-Allow-Origin", "*")
// headers.append("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
// headers.append('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With')

class App extends Component {
	constructor() {
		super();
		this.reloadData();

	}
	
	reloadData() {
		fetch("http://localhost:3000/quotes")
		.then((res) => res.json())
		.then((json) => {
			console.log(json)
			this.setState({
				quotes: json
			});
		});
	}
	
	updateQuote(quoteId, category) {
		const init = {
			method: 'get',
			headers: headers,
			mode: 'cors',
			cache: 'default'
		};
		
		const request = new Request('http://localhost:3000/quotes/complete/' + quoteId + "/" + category);
		fetch(request, init).then((data) => data.json()).then((json) => {
			this.setState({
				quotes: json
			})
		});
		
	}
  render() {
	  if(this.state) {
		  const quotes = this.state.quotes.slice()
		  return(
			  <div>
			  <QuoteList value={quotes} onClick={(quoteId, category) => this.updateQuote(quoteId, category)}/>
			  <AddQuote reFetch={() => this.reloadData()}/>
			  </div>
		  );
	
	  } else {
	  	return <h4>Loading Stupid Trump quotes...</h4>
	  }
  }
}

class QuoteList extends Component {
	
	renderQuote(quote) {
		return <Quote key={quote.id} value={quote} onClick={(quoteId, category) => this.props.onClick(quoteId, category)}/>;
	}
	
	render() {
		const quotes = this.props.value.slice()
		const renderable = quotes.map((quote) => {
			return this.renderQuote(quote)
		});
		return (
			<ul>
			{renderable}
			</ul>
		)
	}
	
	
}

class Quote extends Component {

	render() {
		const quote = this.props.value;
		console.log(quote);
		const category = quote.category;
		return (
			<li>
			{quote.message} <br/ >
			<a href="#" onClick={() => this.props.onClick(quote.id, 'stupid')}>Stupid</a> | 
			<a href="#" onClick={() => this.props.onClick(quote.id, 'dangerous')}>Dangerous</a> | 
			<a href="#" onClick={() => this.props.onClick(quote.id, 'WTF')}>WTF</a> | {category}
			</li>	
		);
	}
}

class AddQuote extends Component {
	createQuote() {
		fetch('https://api.whatdoestrumpthink.com/api/v1/quotes/random').then((quote) => quote.json()).then((json) => {
			
			const request = new Request("http://localhost:3000/quotes/", {
			  method: 'POST',
			  headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json',
			    },
			  body: JSON.stringify({
				message: json.message,
			    category: false,
			    }),
			})
		
		
		
			console.log(request);
		
			fetch(request).then((data) => {
				this.props.reFetch()
			});
		});
		

	}
	
	render() {
		return(
			<div class="right"><a href='#' onClick={() => this.createQuote()}>Show a random Trump quote</a></div>
		)
	}
}

export default App;
