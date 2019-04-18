import React from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'
import BookList from './BookList'
import * as API from './BooksAPI'
import { Route, BrowserRouter } from  'react-router-dom';
import SearchButton from "./SearchButton";
import SearchPage from "./SearchPage";


class BooksApp extends React.Component {
  state = {
	  books: []
  };
  componentDidMount() {
	API.getAll().then(books => {
		this.setState( (currentState) => ({
			...currentState,
			books
		}))
	});
  }

  changeBookShelf = (newBook, newBookShelf) => {

  	API.update(newBook, newBookShelf).then( () => {
		const {books} = this.state;
		const idsBooks = books.filter((book) => book.id === newBook.id);
		let newBooks;
		if(idsBooks.length === 0){
			const newBookWithShelf = {...newBook, shelf: newBookShelf};
			newBooks = books.concat([newBookWithShelf]);
		}else{
			newBooks = books.map((book) => {
				if(book.id === newBook.id){
					const generatedBook = {
						...book,
						shelf : newBookShelf
					};
					return generatedBook;
				}else{
					return book;
				}
			});
		}
		this.setState(() => ({
			books: newBooks
		}))
  	});
  };



  render() {
	const {books} = this.state;

	const booksRead = books.filter((book) => book.shelf === 'read');
	const booksReadingNow = books.filter((book) => book.shelf === 'currentlyReading');
	const booksWantRead = books.filter((book) => book.shelf === 'wantToRead');

	return (
	  <div className="app">
		<BrowserRouter>
		  <Route exact path='/search' render={() => (
			  <SearchPage
				  books={books}
				  onChangeBookShelf={this.changeBookShelf}
			  />
		  )} />
		  <Route exact path='/' render={() => (
			  <div className="list-books">
				<div className="list-books-title">
				  <h1>MyReads</h1>
				</div>
				<div className="list-books-content">
				  <div>
					<div className="bookshelf">
					  <h2 className="bookshelf-title">Currently Reading</h2>
					  <div className="bookshelf-books">
						<BookList
							books={booksReadingNow}
						  	onChangeBookShelf={this.changeBookShelf}
						/>
					  </div>
					</div>
					<div className="bookshelf">
					  <h2 className="bookshelf-title">Want to Read</h2>
					  <div className="bookshelf-books">
						<BookList
							books={booksWantRead}
							onChangeBookShelf={this.changeBookShelf}
						/>
					  </div>
					</div>
					<div className="bookshelf">
					  <h2 className="bookshelf-title">Read</h2>
					  <div className="bookshelf-books">
						<BookList
							books={booksRead}
							onChangeBookShelf={this.changeBookShelf}
						/>
					  </div>
					</div>
				  </div>
				</div>
				<SearchButton
				/>
			  </div>
		  )} />
		</BrowserRouter>
	  </div>
	)
  }
}

export default BooksApp
