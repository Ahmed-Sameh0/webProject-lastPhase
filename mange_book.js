let currentBookId = null;

// =====================
// GET BOOKS FROM DJANGO
// =====================
async function getBooks() {
    const res = await fetch('/api/books/');
    return await res.json();
}

// =====================
// SORT FUNCTION
// =====================
function getSortedBooks(books) {
    let sortVal = document.getElementById('sortSelect').value;
    let sorted = [...books];

    if (sortVal === "newest") sorted.reverse();

    else if (sortVal === "az")
        sorted.sort((a,b) => a.name.localeCompare(b.name));

    else if (sortVal === "za")
        sorted.sort((a,b) => b.name.localeCompare(a.name));

    else if (sortVal === "categoryAZ")
        sorted.sort((a,b) => a.category.localeCompare(b.category));

    else if (sortVal === "categoryZA")
        sorted.sort((a,b) => b.category.localeCompare(a.category));

    return sorted;
}

// =====================
// RENDER TABLE
// =====================
async function renderTable() {
    let books = await getBooks();
    let tbody = document.getElementById('booksTableBody');
    let noMsg = document.getElementById('noBooksMessage');

    tbody.innerHTML = "";

    if (books.length === 0) {
        noMsg.style.display = "block";
        return;
    }

    noMsg.style.display = "none";

    let sorted = getSortedBooks(books);

    sorted.forEach(book => {
        let row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.name}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>
                <button onclick="openEdit(${book.id}, '${book.name}', '${book.author}', '${book.category}', '${book.description}', '${book.image}')">
                    Edit
                </button>

                <button onclick="deleteBook(${book.id})">
                    Delete
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

// =====================
// DELETE BOOK (API)
// =====================
async function deleteBook(id) {
    await fetch(`/api/books/delete/${id}/`, {
        method: "DELETE"
    });

    renderTable();
}

// =====================
// OPEN EDIT MODAL
// =====================
function openEdit(id, name, author, category, description, image) {
    currentBookId = id;

    document.getElementById('editName').value = name;
    document.getElementById('editAuthor').value = author;
    document.getElementById('editCategory').value = category;
    document.getElementById('editDescription').value = description;
    document.getElementById('editImage').value = image;

    document.getElementById('editModal').style.display = "block";
}

// =====================
// CLOSE EDIT
// =====================
function closeEdit() {
    document.getElementById('editModal').style.display = "none";
}

// =====================
// APPLY CHANGES (PUT)
// =====================
async function applyChanges() {

    let data = {
        name: document.getElementById('editName').value,
        author: document.getElementById('editAuthor').value,
        category: document.getElementById('editCategory').value,
        description: document.getElementById('editDescription').value,
        image: document.getElementById('editImage').value
    };

    await fetch(`/api/books/${currentBookId}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    closeEdit();
    renderTable();
}

// =====================
// INIT PAGE
// =====================
renderTable();