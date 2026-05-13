document.querySelector('form').addEventListener('submit', function(a) {
    a.preventDefault();
    const bookId    = document.getElementById('bookId').value.trim();
    const bookName  = document.getElementById('bookName').value.trim();
    const author    = document.getElementById('author').value.trim();
    const category  = document.getElementById('category').value;
    const desc      = document.getElementById('description').value.trim();
    const imageVal  = document.getElementById('book_image').value.trim();

    // --- Validation ---
    if (!bookName) {
        alert('Book name is required.');
        return;
    }
    if (!author) {
        alert('Author name is required.');
        return;
    }
    const categorySelect = document.getElementById('category');
    if (!category || categorySelect.selectedIndex === 0) {
        alert('Please select a category.');
        return;
    }

    // --- Build book object ---
    const bookData = {
        id: bookId || null,
        name: bookName,
        author: author,
        category: category,
        description: desc,
        image: imageVal || 'https://via.placeholder.com/120?text=No+Image'
    };

    // --- Send to Django API ---
    fetch('/api/books/add/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Book added successfully!');
            this.reset();
            setTimeout(() => {
                window.location.href = '/books/';
            }, 500);
        } else {
            alert('Error: ' + (data.error || 'Failed to add book.'));
        }
    })
    .catch(err => {
        alert('Server connection error.');
        console.error(err);
    });
});