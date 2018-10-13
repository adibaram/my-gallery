'use strict'
const KEY_TODOS = 'todos';

var gTodos;
var gTodosFilter = 'all';
var gTodosSort = 'txt';

function createTodos() {
    var todos = getFromStorage(KEY_TODOS);
    gTodos = (todos)? todos : [createTodo('Learn HTML'), createTodo('Practice CSS')] 
}
function createTodo(txt, importance) {
    return {
        id: makeId(),
        txt: txt,
        isDone: false,
        createdAt: Date.now(),
        importance: importance
    }
}

function getTodos() {
    return gTodos.filter(function(todo){
        return gTodosFilter === 'all' || 
               (gTodosFilter === 'done' && todo.isDone) ||
               (gTodosFilter === 'active' && !todo.isDone)
    }).sort(function (todoA,todoB) {
        switch(gTodosSort) {
            case 'txt':
            return todoA.txt > todoB.txt
            case 'created': 
            return todoA.createdAt > todoB.createdAt
    
            case 'importance':
            return todoA.importance > todoB.importance
        }

    });
}

function addTodo(todoTxt, todoImportance) {
    gTodos.unshift(createTodo(todoTxt, todoImportance));
    saveToStorage(KEY_TODOS, gTodos);

}

function toggleTodo(todoId) {
    var todo = gTodos.find(function(todo){
        return todo.id === todoId
    });
    todo.isDone = !todo.isDone;
    saveToStorage(KEY_TODOS, gTodos);
}

function setFilter(statusFilter) {
    gTodosFilter = statusFilter;
}

function setSort(sortBy) {
    gTodosSort = sortBy;
}


function deleteTodo(todoId) {
    var todoIdx = gTodos.findIndex(function(todo){
        return todo.id === todoId;
    })
    gTodos.splice(todoIdx, 1);
    saveToStorage(KEY_TODOS, gTodos);
}

function getTodoCount() {
    return gTodos.length;
}
function getActiveCount() {
    return gTodos.filter(function(todo){
        return !todo.isDone
    }).length
}