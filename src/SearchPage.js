import React from "react";
import {Link} from "react-router-dom";
import BookList from "./BookList";
import * as API from "./BooksAPI";
import PropTypes from "prop-types";

class SearchPage extends React.Component{
    currentDate = new Date();
    timeStampNow = this.currentDate.getTime();

    state = {
        filteredBooks: [],
        updatedTimeStamp: this.timeStampNow
    };
    updateBookListWithShelf = (bookListWithShelf, filteredBookList) => {
        return filteredBookList.map((book) => {
            const idAndShelf = bookListWithShelf.filter((myBook) => myBook.id === book.id);
            if(idAndShelf.length > 0)
                book.shelf = idAndShelf[0].shelf;
            else
                book.shelf = 'none';
            return book;
        });
    };
    updateSearchResults = (event) => {
        const queryInput = event.target.value;
        const {updatedTimeStamp} = this.state;
        const currentDate = new Date();
        const timeStampNow = currentDate.getTime();
        const {books} = this.props;
        const bookListWithShelf = books.map((book) => ({
            id: book.id,
            shelf: book.shelf
        }));
        if(queryInput.length > 0 && updatedTimeStamp < timeStampNow){

            API.search(queryInput).then(filteredBooks => {
                const { error } = filteredBooks;
                const filteredBooksWithShelf = this.updateBookListWithShelf(bookListWithShelf, filteredBooks);
                const newBooks = error ? []: filteredBooksWithShelf;

                this.setState( (currentState) => {
                    if(timeStampNow > currentState.updatedTimeStamp)
                    {
                        return {
                            filteredBooks: newBooks,
                            updatedTimeStamp: timeStampNow
                        }
                    }
                })
            });
        }else{
            this.setState(() => ({
                filteredBooks : [],
                updatedTimeStamp: timeStampNow
            }))
        }
    };

    updateShelfLocal = (oldBook, newBookShelf) => {
        this.props.onChangeBookShelf(oldBook, newBookShelf);
        const {filteredBooks} = this.state;
        const newBooks = filteredBooks.map((book) => {

            if(book.id === oldBook.id){

                const generatedBook = {
                    ...oldBook,
                    shelf: newBookShelf
                };
                return generatedBook;
            }else{
                return book;
            }
        });
        this.setState( () => ({
                filteredBooks: newBooks
            })
        );
    };
    render() {
        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link to='/'>
                        <button className="close-search">
                            Close
                        </button>
                    </Link>
                    <div className="search-books-input-wrapper">
                        {/*
                        NOTES: The search from BooksAPI is limited to a particular set of search terms.
                        You can find these search terms here:
                        https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                        However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                        you don't find a specific author or title. Every search is limited by search terms.
				        */}
                        <input
                            type="text"
                            placeholder="Search by title or author"
                            onChange={this.updateSearchResults}
                        />

                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        <BookList
                            books={this.state.filteredBooks}
                            onChangeBookShelf={this.updateShelfLocal}
                        />
                    </ol>
                </div>
            </div>
        );
    }
}

SearchPage.propTypes = {
    books: PropTypes.array.isRequired,
    onChangeBookShelf: PropTypes.func.isRequired
};

export default SearchPage