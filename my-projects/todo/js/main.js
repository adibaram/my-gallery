'use strict'

// This is our controller it is responsible for rendering the view and action upon events
console.log('Todo');

function init() {
    createTodos();
    render();
}

function render() {
    renderTodos();
    renderStats();
}


function renderTodos() {
    var todos = getTodos();
    // var todosCount = getTodoCount();

        var strHtmls = todos.map(function (todo) {
            return `<li class="${(todo.isDone) ? 'todo done' : 'todo'}" onclick="onTodoClicked('${todo.id}')">
                   ${todo.txt}
                   <button class="btn-delete" onclick="onDeleteTodo('${todo.id}', event)">
                      &times;
                    </button>
                </li>`;
        })
        document.querySelector('.todo-list').innerHTML = strHtmls.join('')
}

function renderStats() {

    var todosCount = getTodoCount();
    var activeCount = getActiveCount(); 

    document.querySelector('.todo-count').innerHTML = todosCount;
    document.querySelector('.active-count').innerHTML = activeCount;
    var elNoTodos = document.querySelector('.no-todos');

    if (todosCount === 0) {
        elNoTodos.style = 'display: block'
        
    } else {
        elNoTodos.style = 'display: none'
    }

}


function onTodoClicked(todoId) {
    toggleTodo(todoId);
    render();
}

function onSetFilter(statusFilter) {
    setFilter(statusFilter);
    render();
}

function onSortList(sortBy) {
    setSort(sortBy);
    render();
}

function onAddTodo() {
    //text
    var elNewTodoTxt = document.querySelector('#newTodoTxt');
    var elNewTodoImportance = document.querySelector('#todo-importance');
    //importance
    var newTodoImportance = elNewTodoImportance.value;
    var newTodoTxt = elNewTodoTxt.value;

    if (newTodoTxt === '') { alert('Please insert text'); return; }
    if (newTodoImportance === 'Importance') { alert('Please select importance'); return; }
    addTodo(newTodoTxt, newTodoImportance);

    document.querySelector('h4').classList.add('animated', 'tada');
    setTimeout(function () {
        document.querySelector('h4').classList.remove('animated', 'tada');
    }, 1000)

    elNewTodoTxt.value = '';
    elNewTodoImportance.value = 'Importance'
    render()
}

function onDeleteTodo(todoId, ev) {
    // Stop the propegation of the click event so the LI onclick will not trigger
    ev.stopPropagation();

    var r = confirm("Are you sure you want to delete this task?");
    if (r == true) {
        deleteTodo(todoId);
        render();
    } else {
        return;
    }
}