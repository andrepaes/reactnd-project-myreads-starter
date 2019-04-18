import React,{Component} from 'react';
import Book from './Book'
import PropTypes from "prop-types";

class BookList extends Component{
    callChangeBookShelf = (book, newShelf) => {
        this.props.onChangeBookShelf(book, newShelf)
    }
    render(){
        const {books} = this.props;
        return(
            <ol className="books-grid">
                {books.map((bookObj) => (
                        <li key={bookObj.id}>
                            <Book
                                id={bookObj.id}
                                title={bookObj.title}
                                authors={bookObj.authors}
                                imageLinks={bookObj.imageLinks}
                                shelf={bookObj.shelf}
                                onChangeBookShelf={(newShelf) => {this.props.onChangeBookShelf(bookObj, newShelf)}}
                            />
                        </li>
                    ))}
            </ol>
        )
    }
}

BookList.propTypes = {
    books: PropTypes.array.isRequired,
    onChangeBookShelf: PropTypes.func.isRequired
};

export default BookList;