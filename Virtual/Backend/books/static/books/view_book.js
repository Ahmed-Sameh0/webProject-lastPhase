let books = [];

window.addEventListener('load', () => {
    fetch('/api/books/')
        .then(res => res.json())
        .then(data => {
            books = data;
            displayAllBooks();
        })
        .catch(err => {
            document.getElementById('categoryContainer').innerHTML = '<p style="color:red;">Error loading books.</p>';
        });
});

function generateBookCard(book) {
    return `
        <div class="book-card">
            <img src="${book.image}" alt="Book Cover" onerror="this.src='https://via.placeholder.com/120'">
            <h3>${book.name}</h3>

            <div class="card-buttons">
                <button class="view-btn" onclick="viewBook(${book.id})">View</button>

                ${
                    book.isBorrowed
                    ? `<button disabled style="opacity:0.5;">Not Available</button>`
                    : `<button class="borrow_btn_script" data-id="${book.id}">Borrow</button>`
                }
            </div>
        </div>
    `;
}

function displayAllBooks() {
    const container = document.getElementById('categoryContainer');
    container.innerHTML = '';
    if (books.length === 0) {
        container.innerHTML = '<p style="color:red;">No books found</p>';
        return;
    }
    const categories = {};
    books.forEach(book => {
        let cat = book.category.trim().toLowerCase();
        if (!categories[cat]) {
            categories[cat] = [];
        }
        categories[cat].push(book);
    });
    Object.keys(categories).forEach(category => {
        let displayName = category.charAt(0).toUpperCase() + category.slice(1);
        container.innerHTML += `<h2>${displayName}</h2>`;
        
        let booksHTML = `<div class="books-container">`;
        categories[category].forEach(book => {
            booksHTML += generateBookCard(book);
        });
        booksHTML += `</div><hr>`;
        
        container.innerHTML += booksHTML;
    });
}

function viewBook(bookId) {
    window.location.href = `/books/${bookId}/`;
}


document.addEventListener('click', function (e) {
    if (e.target.classList.contains('borrow_btn_script')) {
        const bookId = e.target.getAttribute('data-id');
        borrowBook(bookId);
    }
});

function borrowBook(bookId) {
    fetch(`/books/${bookId}/borrow/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(() => {
        alert("Book borrowed successfully!");
        location.reload();
    })
    .catch(err => {
        console.error(err);
        alert("Error borrowing book");
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}