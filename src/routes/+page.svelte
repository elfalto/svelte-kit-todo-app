<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import {
		loginDebugUser,
		loginUser,
		getAllTodos,
		addTodo,
		deleteTodo,
		updateTodoCompletion
	} from '$lib/todoService';
	import TodoList from './TodoList.svelte';
	import type { Todo_t } from '$lib/types';

	let todos: Todo_t[] = [];
	let todo: Todo_t = { task: '', isComplete: false, createdAt: new Date(), id: '', deleted: false };

	let user: any = null;
	let email = '';
	let password = '';
	let error = '';

	onMount(() => {
		loginDebugUser();
		getTodos();
	});

	// onMount(() => {
	//     onAuthStateChanged(auth, (currentUser) => {
	//         user = currentUser;
	//         if (user) {
	//             subscribeToTodos((fetchedTodos) => {
	//                 todos = fetchedTodos;
	//             });
	//         } else {
	//             todos = [];
	//         }
	//     });
	// });

	async function getTodos() {
		try {
			todos = await getAllTodos();
		} catch (e) {
			error = 'Error fetching todos';
		}
	}

	async function handleAddTodo() {
		if (todo.task === '') {
			error = 'Please enter text before adding a todo';
			return;
		}
		error = '';
		let newTodo = { ...todo, createdAt: new Date() };
		try {
			const addedTodo = await addTodo(newTodo);
			if (addedTodo) {
				newTodo.id = addedTodo.id;
				todos = [...todos, newTodo];
				todo.task = '';
			}
		} catch (e) {
			error = 'Error adding todo to Firestore';
		}
	}

	async function handleUpdateTodoStatus(todo: Todo_t) {
		try {
			await updateTodoCompletion(todo);
		} catch (e) {
			error = 'Error updating todo status';
		}
	}

	async function handleDeleteTodo(todo: Todo_t) {
		try {
			await deleteTodo(todo);
			todos = todos.filter((t) => t.id !== todo.id);
		} catch (e) {
			error = 'Error deleting todo';
		}
	}

	// async function register() {
	// 	try {
	// 		await createUserWithEmailAndPassword(auth, email, password);
	// 		error = '';
	// 	} catch (e: any) {
	// 		error = e.message;
	// 	}
	// }

	async function login() {
		try {
			await loginUser(email, password);
			error = '';
		} catch (e: any) {
			error = e.message;
		}
	}

	// async function logout() {
	// 	try {
	// 		await signOut(auth);
	// 		error = '';
	// 	} catch (e: any) {
	// 		error = e.message;
	// 	}
	// }

	function checkKeydownForEnter(event: any) {
		if (event.key === 'Enter') {
			handleAddTodo();
		}
	}
</script>

<svelte:head>
	<title>Todo</title>
	<meta name="description" content="Todo Page" />
</svelte:head>

<div class="text-column">
	<div class="container">
		<!-- {#if user} -->
		<div class="input-container">
			<input
				name="text-input"
				class="text-input"
				type="text"
				placeholder="Add a todo"
				bind:value={todo.task}
			/>
			<button on:click={handleAddTodo}>Add</button>
		</div>

		<TodoList {todos} onUpdate={handleUpdateTodoStatus} onDelete={handleDeleteTodo} />

		<!--
		<button on:click={logout}>Logout</button>
		 {:else}
        <div class="auth-container">
            <input
                type="email"
                placeholder="Email"
                bind:value={email}
            />
            <input
                type="password"
                placeholder="Password"
                bind:value={password}
            />
            <button on:click={login}>Login</button>
            <button on:click={register}>Register</button>
        </div>
    {/if} -->

		<div class="error-container">
			{#if error}
				<p class="error">{error}</p>
			{/if}
		</div>
	</div>
</div>

<section />

<svelte:window on:keydown={checkKeydownForEnter} />

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
