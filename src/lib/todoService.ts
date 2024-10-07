import PocketBase from 'pocketbase';
import RecordModel from 'pocketbase';
import type { Todo_t } from '$lib/types';

const pb = new PocketBase('https://pocketbase-production-acf1.up.railway.app/');
console.log('PocketBase:', pb);

const DEBUG_USER = 'debug';
const DEBUG_PASSWORD = 'debugdebugdebug';
let auth: any = null;

export async function loginDebugUser() {
    try {
        const authData = await pb.collection('users').authWithPassword(DEBUG_USER, DEBUG_PASSWORD);
        auth = authData;
        console.log('Logged in as debug:', authData);
    } catch (error) {
        console.error('Failed to log in as debug:', error);
        auth = null;
    }
}

export async function loginUser(username: string, password: string) {
    try {
        const authData = await pb.collection('users').authWithPassword(username, password);
        auth = authData;
        console.log('Logged in as:', authData);
    } catch (error) {
        console.error('Failed to log in:', error);
        auth = null;
    }
}

/// gets all todos that are not set to deleted = true
export async function getAllTodos() {
    if (!auth) {
        try {
            let records = await pb.collection('todos').getFullList({
                sort: '-createdAt', // Sort by createdAt date in descending order
                expand: 'createdBy'  // Expand the 'createdBy' field to include user details
            });
            records = records.filter(todo => !todo.deleted);
            
            console.log('Fetched todos:', records);
            return records as unknown as Todo_t[];
        } catch (error) {
            console.error('Failed to fetch todos:', error);
            return [];
        }
    }
}


export async function updateTodoCompletion(todo: Todo_t) {
    try {
        await loginDebugUser(); // Ensure we're logged in
        const updatedTodo = await pb.collection('todos').update(todo.id, { isComplete: todo.isComplete });
        console.log('Todo completion status updated:', updatedTodo);
        return updatedTodo;
    } catch (error) {
        console.error('Failed to update todo completion status:', error);
        return null;
    }
}

export async function deleteTodo(todo: Todo_t) {
    if (!auth) {
        console.error('Not logged in');
        return null;
    }
    try {
        const updatedTodo = await pb.collection('todos').update(todo.id, { deleted: true });
        console.log('Todo set to deleted:', updatedTodo);
        return updatedTodo;
    } catch (error) {
        console.error('Failed to delete todo:', error);
        return null;
    }
}

export async function addTodo(todo: Todo_t) {
    if (!auth) {
        console.error('Not logged in');
        return null;
    }
    try {
        const newTodo = await pb.collection('todos').create(todo);
        console.log('Todo added:', newTodo);
        return newTodo;
    } catch (error) {
        console.error('Failed to add todo:', error);
        return null;
    }
}
